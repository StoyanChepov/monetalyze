import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { Plan } from '../plan';
import { LanguageService } from '../../shared/language';

@Component({
  selector: 'app-plan-details',
  imports: [RouterLink],
  templateUrl: './plan-details.html',
  styleUrl: './plan-details.css'
})
export class PlanDetails {
  id = input.required<string>()
  languageService = inject(LanguageService);

  plan = httpResource<Plan[]>(
    () => `plans.${this.languageService.language()}.json`
  );

  singlePlan = computed(() =>
    this.plan.value()?.find(
      item => item.id == this.id())
  )
}