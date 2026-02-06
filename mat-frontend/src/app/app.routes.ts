import { Routes } from '@angular/router';
import { Login } from './core/login/pages/login';
import { Dashboard } from './features/dashboard/dashboard';
import { BlindtestMenu } from './features/blindtest/blindtest-menu/blindtest-menu';
import { BlindtestGame } from './features/blindtest/blindtest-game/blindtest-game';
import { Layout } from './core/layout/layout/layout';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: Login },
    {
      path: '',
      component: Layout,
      canActivate: [authGuard],
      canActivateChild: [authGuard],
      children: [
        { path: 'dashboard', component: Dashboard },
        { path: 'blindtest-menu', component: BlindtestMenu },
        { path: 'blindtest-game', component: BlindtestGame },
      ]
    }
];
