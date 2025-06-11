import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { TokenResponce } from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';

  accessToken: string | null = null;
  refreshToken: string | null = null;

  get isAuth() {
    return !!this.accessToken;
  }

  login(payload: { username: string; password: string }) {
    const formdata = new FormData();
    formdata.append('username', payload.username);
    formdata.append('password', payload.password);
    return this.http
      .post<TokenResponce>(`${this.baseApiUrl}token`, formdata)
      .pipe(
        tap((val) => {
          this.accessToken = val.access_token;
          this.refreshToken = val.refresh_token;
        })
      );
  }
}
