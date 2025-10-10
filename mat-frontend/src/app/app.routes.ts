import { Routes } from '@angular/router';
import { Login } from './core/login/pages/login';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: Login },
	{ path: 'dashboard', component: Dashboard }
];