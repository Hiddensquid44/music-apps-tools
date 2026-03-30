import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { LoginData } from '../login-data';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Utils } from '../../../shared/utils';
import { environment } from '../../../../environments/environment';
import { GlobalData } from '../../../shared/global-data';
import { BlindtestData } from '../../../features/blindtest/blindtest-data';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    constructor(@Inject(PLATFORM_ID)
        private platformId: Object,
        private router: Router
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
        if (LoginData.accessToken) {
            console.error('Access token already set.');
            return;
        }
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: environment.redirectUri
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                // Use a helper that works both in browser and (if necessary) server-side environments.
                'Authorization': 'Basic ' + Utils.encodeBase64(LoginData.clientId + ':' + LoginData.clientSecret),
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });
        const data = await response.json();
        if (!data.access_token) {
            throw new Error(data.error + data.error_description)
        }
        LoginData.accessToken = data.access_token;
        LoginData.refreshToken = data.refresh_token;
    }

    public async refreshToken(): Promise<boolean> {
        // Use the refresh token to obtain a new access token
        if (!LoginData.refreshToken) {
            console.error('No refresh token available for refresh.');
            this.logout(); // Clear any invalid state just in case
            return false;
        }

        try {
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

            if (!data.access_token) {
                console.error('Refresh response did not include access_token', data);
                return false;
            }

            LoginData.accessToken = data.access_token;
            // Spotify may or may not return a new refresh_token; update if present
            if (data.refresh_token) {
                LoginData.refreshToken = data.refresh_token;
            }

            return true;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false;
        }
    }

    public isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    public logout() {
        LoginData.clearLoginData();
        GlobalData.clearGlobalData();
        BlindtestData.clearBlindtestData();
        const spotifyLogoutWindow = window.open('https://accounts.spotify.com/en/logout', 'Spotify Logout', 'width=700,height=500,top=40,left=40');
        if (!spotifyLogoutWindow) throw new Error(
            'Spotify logout window could not be opened. Please make sure that the Spotify app is installed and that you are logged in to Spotify.'
        )
        setTimeout(async () => {
          spotifyLogoutWindow.close();
          await this.router.navigate(['/login']);
        }, 200)
    }

}
