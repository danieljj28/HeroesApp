import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, pipe, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(
    private http: HttpClient
  ) { }

  get currentUser(): User | undefined{
    if( !this.user ) return undefined;
    return structuredClone(this.user);
  }

  login( email: string, password: string ): Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap( user => this.user = user ),
        tap ( user => localStorage.setItem('token', 'aIOSNMKA.asdasd.OPDJE0' ))
      )
  }

  checkAuthentication(): Observable<boolean> {
    if ( !localStorage.getItem('token') ) return of(false);

    const token = localStorage.getItem( 'token' );

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => this.user = user),
        map( user => !!user ),
        catchError( err => of(false))
      )
  }

  logout(): void {
    this.user = undefined;
    localStorage.removeItem( 'token' );
  }

}
