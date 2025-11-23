import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../../../core/login/services/login-service';
import { catchError, from, lastValueFrom, switchMap } from 'rxjs';
import { LoginData } from '../../../core/login/login-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient, private loginService: LoginService) {}

  public async getRequest<T>(url: string, options: any = {}): Promise<T> {
    const fixedOptions = this.fixOptions(options);
    if (!this.isTokenValid()) {
      const requestAfterRefreshToken = await lastValueFrom(from(this.loginService.refreshToken()).pipe(
        switchMap(()=> from(this.getRequest<T>(url, options)))
      ));
      return requestAfterRefreshToken;
    }
    const response = await lastValueFrom(
      this.http.get<T>(url, fixedOptions as { observe: 'body' }).pipe(
       catchError((error) => {
         if (error?.error?.error?.message === 'The access token expired') {
          return from(this.loginService.refreshToken()).pipe(
            switchMap(()=> from(this.getRequest<T>(url, options)))
          );
         }
         throw error;
       })
      )
    );
    return response;
  }

  public async postRequest(url: string, options: any = {}): Promise<void> {
    const fixedOptions = this.fixOptions(options);
    if (!this.isTokenValid()) {
      await lastValueFrom(from(this.loginService.refreshToken()).pipe(
        switchMap(()=> from(this.postRequest(url, options)))
      ));
      return;
    }
    await lastValueFrom(
      this.http.post(url, null, fixedOptions as { observe: 'body' }).pipe(
       catchError((error) => {
         if (error?.error?.error?.message === 'The access token expired') {
          return from(this.loginService.refreshToken()).pipe(
            switchMap(()=> from(this.postRequest(url, options)))
          );
         }
         throw error;
       })
      )
    );
    return;
  }

  public async putRequest(url: string, options: any = {}): Promise<void> {
    const fixedOptions = this.fixOptions(options);
    if (!this.isTokenValid()) {
      await lastValueFrom(from(this.loginService.refreshToken()).pipe(
        switchMap(()=> from(this.putRequest(url, options)))
      ));
      return;
    }
    await lastValueFrom(
      this.http.put(url, null, fixedOptions as { observe: 'body' }).pipe(
       catchError((error) => {
         if (error?.error?.error?.message === 'The access token expired') {
          return from(this.loginService.refreshToken()).pipe(
            switchMap(()=> from(this.putRequest(url, options)))
          );
         }
         throw error;
       })
      )
    );
    return;
  }

  private async isTokenValid() {
    if (!LoginData.accessToken && !LoginData.refreshToken) {
      this.loginService.logout();
      throw new Error("User disconnected, need to log again");
    }
    if (!LoginData.accessToken) {
      return false;
    }
    return true;
  }

  private fixOptions(options: any = {}) {
    return {
      ...options,
      observe: 'body' as const
    };
  }
  
}
