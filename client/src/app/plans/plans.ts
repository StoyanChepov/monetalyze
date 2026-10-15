import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Plan } from './plan'
import { map, Observable, pipe } from 'rxjs';

import { environment } from '../../environments/environment';

export interface PlansResponse {
    items: Plan[];
    total: number | null;
    page: number;
    pageSize: number;
}

@Service()
/*@Injectable({
  providedIn: 'root'
})*/
export class Plans {
    private http = inject(HttpClient);

    /*getPlans(): Observable<Plan[]> {
        return this.http.get<Plan[]>('/service_plans.json');
    }*/

    getPlans(
        page: number,
        pageSize: number,
        language: string
    ): Observable<PlansResponse> {
        return this.http
            .get<Plan[]>(`plans.${language}.json`)
            .pipe(
                map(plans => {
                    const total = plans.length;
                    const start = (page - 1) * pageSize;

                    return {
                        items: plans.slice(start, start + pageSize),
                        total,
                        page,
                        pageSize
                    };
                })
            );
    }
}
