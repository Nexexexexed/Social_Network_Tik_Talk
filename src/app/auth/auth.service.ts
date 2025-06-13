import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponce } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  cookieServicer = inject(CookieService);
  router = inject(Router);

  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';

  accessToken: string | null = null;
  refreshToken: string | null = null;

  get isAuth() {
    if (!this.accessToken) {
      this.accessToken = this.cookieServicer.get('token');
      this.refreshToken = this.cookieServicer.get('refreshToken');
    }
    return !!this.accessToken;
  }

  login(payload: { username: string; password: string }) {
    const formdata = new FormData();
    formdata.append('username', payload.username);
    formdata.append('password', payload.password);
    return this.http
      .post<TokenResponce>(`${this.baseApiUrl}token`, formdata)
      .pipe(
        tap((res) => {
          this.saveTokens(res);
        })
      );
  }

  refreshAuthToken() {
    return this.http
      .post<TokenResponce>(`${this.baseApiUrl}refresh`, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        tap((res) => {
          this.saveTokens(res);
        }),
        catchError((e) => {
          this.logout();
          return throwError(e);
        })
      );
  }

  logout() {
    this.cookieServicer.deleteAll();
    this.accessToken = null;
    this.refreshToken = null;
    this.router.navigate(['/login']);
  }

  saveTokens(res: TokenResponce) {
    this.accessToken = res.access_token;
    this.refreshToken = res.refresh_token;
    this.cookieServicer.set('token', this.accessToken);
    this.cookieServicer.set('refreshToken', this.refreshToken);
  }
}
