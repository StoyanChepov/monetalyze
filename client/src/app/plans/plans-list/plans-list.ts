import { Component, effect, inject, signal } from '@angular/core';
import { Plans } from '../plans';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, catchError, combineLatest, debounceTime, map, of, startWith, switchMap } from 'rxjs';
import { Plan } from '../plan';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../shared/language';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  imports: [AsyncPipe, ReactiveFormsModule, RouterLink],
  selector: 'app-plans-list',
  styleUrl: './plans-list.css',
  templateUrl: './plans-list.html',
})
export class PlansList {
  private plansService = inject(Plans);
  private languageService = inject(LanguageService);
  //columns = signal(0);
  columns = signal(Number(localStorage.getItem('columns') ?? 0));
  private save = effect(() => localStorage.setItem('columns', String(this.columns())));

  readonly pageSizeOptions = [10, 25, 50, 100];
  private pagination$ = new BehaviorSubject({
    page: 1,
    pageSize: this.pageSizeOptions[0]
  });

  searchControl = new FormControl('', { nonNullable: true });

  private readonly VIEW_KEY = 'service-plans-view';
  view = signal<'list' | 'grid'>(this.loadView());

  private saveView = effect(() => {
    localStorage.setItem(this.VIEW_KEY, this.view());
  });

  private loadView(): 'list' | 'grid' {
    try {
      return localStorage.getItem(this.VIEW_KEY) === 'grid' ? 'grid' : 'list';
    } catch {
      return 'list';
    }
  }
  private readonly language$ = toObservable(
    this.languageService.language
  );

  private state$ = combineLatest([
    this.pagination$,
    this.language$,
  ]).pipe(
    switchMap(([{ page, pageSize }, language]) =>
      this.plansService.getPlans(page, pageSize, language).pipe(
        map(response => ({
          status: 'success' as const,
          page,
          pageSize,
          plans: response.items,
          total: response.total,
        })),
        catchError(error => {
          console.error('Failed to load service plans:', error);

          return of({
            status: 'error' as const,
            page,
            pageSize,
            plans: [] as Plan[],
            total: null as number | null,
          });
        }),
        startWith({
          status: 'loading' as const,
          page,
          pageSize,
          plans: [] as Plan[],
          total: null as number | null,
        }),
      ),
    ),
  );

  private term$ = this.searchControl.valueChanges.pipe(
    startWith(this.searchControl.value),
    map(term => term.trim().toLowerCase()),
    debounceTime(200)
  );

  vm$ = combineLatest([this.state$, this.term$]).pipe(
    map(([state, term]) => ({
      ...state,
      plans: state.plans.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          String(p.id).toLowerCase().includes(term),
      ),
      totalPages:
        state.total !== null
          ? Math.ceil(state.total / state.pageSize)
          : null,
      hasPrev: state.page > 1,
      hasNext:
        state.total !== null
          ? state.page * state.pageSize < state.total
          : state.plans.length === state.pageSize,
    })),
  );

  changePageSize(pageSize: number) {
    this.pagination$.next({
      page: 1,
      pageSize
    });
  }

  goToPage(page: number) {
    const current = this.pagination$.value;
    if (page >= 1) this.pagination$.next({ ...current, page });
  }

  /*descriptionPreview(html: string, limit = 100): string {
    const element = document.createElement('div');
    element.innerHTML = html;
    const text = (element.textContent || '').replace(/\s+/g, ' ').trim();

    return text.length > limit
      ? text.slice(0, limit).trimEnd() + '…'
      : text;
  }*/
}
