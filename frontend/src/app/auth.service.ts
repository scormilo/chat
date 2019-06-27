import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { User } from './user';

// con este servicio podemos validar frente al servidor si el token que se envia es el correcto
// o si el usuario usuario esta logueado seria las funciones frente al login como tal

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState  =  new  BehaviorSubject(false);
  AUTH_SERVER: string = 'http://localhost:3000';
  constructor(private httpClient: HttpClient, private storage: Storage) { }

  register(userInfo: User): Observable<User> {
    return this.httpClient.post<User>(`${this.AUTH_SERVER}/register`, userInfo);
  }

  login(userInfo: User): Observable<any> {
    return this.httpClient.post(`${this.AUTH_SERVER}/login`, userInfo).pipe(
      tap(async (res: { status: number, access_token, expires_in, user_id }) => {
        if (res.status !== 404) {
          await this.storage.set('ACCESS_TOKEN', res.access_token);
          await this.storage.set('EXPIRES_IN', res.expires_in);
          await this.storage.set('USER_ID', res.user_id);
          this.authState.next(true);
        }
      })
    );
  }
  async logout() {
    await this.storage.remove('ACCESS_TOKEN');
    await this.storage.remove('EXPIRES_IN');
    await this.storage.remove('USER_ID');
    this.authState.next(false);
  }
  async isLoggedIn() {
    return this.authState.value;
  }
  checkTokenExists(): Promise<boolean>{
    return new Promise((resolve) => {
      this.storage.get('ACCESS_TOKEN').then(token => {
        if(token !== null){
          this.authState.next(true);
          resolve(true);
        } else {
          this.authState.next(false);
          resolve(false);
        }
      })
    })
  }

}
