import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map, switchMap } from 'rxjs';

import {
  Character,
  PaginatedResponse,
  Location as ApiLocation,
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class CharactersService {
  private apiUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  getCharactersByPage(page: number): Observable<PaginatedResponse<Character>> {
    return this.http.get<PaginatedResponse<Character>>(
      `${this.apiUrl}/character?page=${page}`
    );
  }

  getCharacters(): Observable<PaginatedResponse<Character>> {
    return this.http.get<PaginatedResponse<Character>>(
      `${this.apiUrl}/character`
    );
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/character/${id}`);
  }

  getAllLocations(): Observable<ApiLocation[]> {
    return this.http
      .get<PaginatedResponse<ApiLocation>>(`${this.apiUrl}/location`)
      .pipe(
        switchMap((firstPage) => {
          const totalPages = firstPage.info.pages;

          const requests: Observable<PaginatedResponse<ApiLocation>>[] = [];
          for (let page = 1; page <= totalPages; page++) {
            requests.push(
              this.http.get<PaginatedResponse<ApiLocation>>(
                `${this.apiUrl}/location?page=${page}`
              )
            );
          }

          return forkJoin(requests).pipe(
            map((responses) => responses.flatMap((r) => r.results)) // ApiLocation[]
          );
        })
      );
  }
}
