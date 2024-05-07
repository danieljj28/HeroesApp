import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }

  // READ - GET
  getHeros(): Observable<Hero[]>{
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`)
  }

  getHeroById( id: string ): Observable<Hero | undefined>{
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`).
      pipe(
        catchError( error => of(undefined) )
      )
  }

  getSuggestions( query: string ): Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${ query }&_limit=6`)
  }

  // CREATE - POST
  addHero( hero: Hero ): Observable<Hero>{
    console.log("Estoy en add")
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero)
  }

  // UPDATE - FETCH
  updateHero( hero: Hero ): Observable<Hero>{
    if( !hero.id ) throw Error('Hero id is required');
    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${ hero.id }`, hero)
  }

  // DELETE - DELETE
  deleteHeroById( id: string): Observable<boolean>{
    return this.http.delete(`${this.baseUrl}/heroes/${ id }`)
      .pipe(
        map( () => true ),
        catchError( () => of(false) ),
      );
  }
}
