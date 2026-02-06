import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginData } from '../login/login-data';
import { LoginService } from '../login/services/login-service';

// Standalone function guard compatible avec les routes Angular modernes
export const authGuard: CanActivateFn = async (_route, _state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  // If we already have an access token, allow
  if (LoginData.accessToken) {
    return true;
  }

  // Otherwise, try to refresh the token (if refresh token available)
  try {
    const refreshed = await loginService.refreshToken();
    if (refreshed) return true;
  } catch (err) {
    console.error('Error while attempting token refresh in guard:', err);
  }

  // If we reach here, return a UrlTree redirecting to login (best practice)
  return router.createUrlTree(['/login']);
};
