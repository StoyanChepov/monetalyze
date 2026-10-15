import { Routes } from '@angular/router';
import { PlansList } from './plans/plans-list/plans-list';
import { PlanDetails } from './plans/plan-details/plan-details';

export const routes: Routes = [
    {
        path: 'plans',
        component: PlansList
    },
    {
        path: 'plans/:id',
        component: PlanDetails
    },
    {
        path: '',
        redirectTo: 'plans',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'plans'
    }];
