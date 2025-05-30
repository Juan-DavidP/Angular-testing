import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  htpp = inject(HttpClient);

  login(email: string, password: string): Observable<{token: string}>{
    return this.htpp.post<{token: string}>('/api/login', {email, password});
  }
  constructor() { }
}
