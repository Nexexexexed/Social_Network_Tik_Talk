import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Profile } from '../interfaces/provide.interface';
import { Pageble } from '../interfaces/pageble.interface';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  constructor() {}

  baseApiUrl = 'https://icherniakov.ru/yt-course';

  me = signal<Profile | null>(null);

  getTestAccount() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}/account/test_accounts`);
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}/account/${id}`);
  }

  getMe() {
    return this.http
      .get<Profile>(`${this.baseApiUrl}/account/me`)
      .pipe(tap((res) => this.me.set(res)));
  }

  getSubscribersShortList() {
    return this.http
      .get<Pageble<Profile>>(
        `${this.baseApiUrl}/account/subscribers/?page=1&size=50`
      )
      .pipe(map((res) => res.items.slice(0, 3)));
  }
}
