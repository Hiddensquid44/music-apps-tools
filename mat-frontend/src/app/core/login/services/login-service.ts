import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { LoginData } from '../login-data';
import { isPlatformBrowser } from '@angular/common';
import { Utils } from '../../../shared/utils';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    constructor(@Inject(PLATFORM_ID)
        private platformId: Object,
    ) { }

    public async retrieveCode() {
        const state = Utils.generateRandomString(16);
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: LoginData.clientId,
            scope: LoginData.scope,
            redirect_uri: environment.redirectUri,
            state: state
        });
        if (this.isBrowser()) {
            window.location.href = 'https://accounts.spotify.com/authorize?' + params.toString();
        } else {
            // In an SSR context we can't perform a redirect. Log and no-op.
            console.warn('retrieveCode called in non-browser environment; redirect skipped.');
        }
    }

    public async getToken(code: string) {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: environment.redirectUri
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                // Use a helper that works both in browser and (if needed) server-side environments.
                'Authorization': 'Basic ' + Utils.encodeBase64(LoginData.clientId + ':' + LoginData.clientSecret),
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });
        const data = await response.json();
        LoginData.accessToken = data.access_token;
        LoginData.refreshToken = data.refresh_token;
    }

    public async refreshToken() {
        if (LoginData.accessToken === '') {
            console.error('No access token available for refresh.');
            return;
        }

        // Implement token refresh logic if needed
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: LoginData.refreshToken
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Utils.encodeBase64(LoginData.clientId + ':' + LoginData.clientSecret),
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });
        const data = await response.json();
        LoginData.accessToken = data.access_token;
        LoginData.refreshToken = data.refresh_token;
    }

    public isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }
  
}
