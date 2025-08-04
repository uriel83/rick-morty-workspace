// characters.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map, switchMap } from 'rxjs';

// טיפוסים מהמודלים + Alias ל-Location כדי לא להתנגש עם window.Location (DOM)
import {
  Character,
  PaginatedResponse,
  Location as ApiLocation,
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class CharactersService {
  // בסיס ה-URL של ה-Rick & Morty API
  private apiUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  /** עמוד ספציפי של דמויות */
  getCharactersByPage(page: number): Observable<PaginatedResponse<Character>> {
    return this.http.get<PaginatedResponse<Character>>(
      `${this.apiUrl}/character?page=${page}`
    );
  }

  /** עמוד ראשון של דמויות (ברירת מחדל API) */
  getCharacters(): Observable<PaginatedResponse<Character>> {
    return this.http.get<PaginatedResponse<Character>>(
      `${this.apiUrl}/character`
    );
  }

  /** דמות לפי מזהה */
  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/character/${id}`);
  }

  /**
   * כל המיקומים (כל העמודים) כ-ApiLocation[]:
   * 1) מביאים עמוד ראשון כדי לדעת info.pages
   * 2) יוצרים בקשות לכל העמודים 1..pages
   * 3) forkJoin לכל הבקשות ו-flat לתוצאה אחת
   */
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
