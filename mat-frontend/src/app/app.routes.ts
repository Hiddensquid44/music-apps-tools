import { Routes } from '@angular/router';
import { Login } from './core/login/pages/login';
import { Dashboard } from './features/dashboard/dashboard';
import { BlindtestMenu } from './features/blindtest/blindtest-menu/blindtest-menu';
import { BlindtestGame } from './features/blindtest/blindtest-game/blindtest-game';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: Login },
	{ path: 'dashboard', component: Dashboard },
    { path: 'blindtest-menu', component: BlindtestMenu },
    { path: 'blindtest-game', component: BlindtestGame },
];