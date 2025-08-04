import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { CharactersService } from './characters.service';
import {
  Character,
  PaginatedResponse,
  Location as ApiLocation,
} from '../models/models';

describe('CharactersService (HTTP)', () => {
  let service: CharactersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CharactersService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CharactersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getCharactersByPage() should call correct URL and return expected data', () => {
    service.getCharactersByPage(2).subscribe((res: PaginatedResponse<Character>) => {
      expect(res.info.pages).toBe(42);
      expect(res.results.length).toBe(1);
      expect(res.results[0].id).toBe(1);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character?page=2');
    expect(req.request.method).toBe('GET');

    req.flush({
      info: { count: 1, pages: 42, next: null, prev: null },
      results: [{ id: 1 }],
    } as PaginatedResponse<Character>);
  });

  it('getCharacterById() should call correct URL and return Character', () => {
    service.getCharacterById(99).subscribe((res: Character) => {
      expect(res.id).toBe(99);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character/99');
    expect(req.request.method).toBe('GET');

    req.flush({ id: 99 } as Character);
  });

  it('getAllLocations() should load all pages and flatten results', () => {
    service.getAllLocations().subscribe((locs: ApiLocation[]) => {
      expect(locs.map(l => l.id)).toEqual([10, 11, 20]);
    });

    const first = httpMock.expectOne('https://rickandmortyapi.com/api/location');
    expect(first.request.method).toBe('GET');

    first.flush({
      info: { count: 3, pages: 2, next: '...', prev: null },
      results: [{ id: 999 }],
    } as PaginatedResponse<ApiLocation>);

    const page1 = httpMock.expectOne('https://rickandmortyapi.com/api/location?page=1');
    const page2 = httpMock.expectOne('https://rickandmortyapi.com/api/location?page=2');
    expect(page1.request.method).toBe('GET');
    expect(page2.request.method).toBe('GET');

    page1.flush({
      info: { count: 3, pages: 2, next: '...', prev: null },
      results: [{ id: 10 }, { id: 11 }],
    } as PaginatedResponse<ApiLocation>);

    page2.flush({
      info: { count: 3, pages: 2, next: null, prev: '...' },
      results: [{ id: 20 }],
    } as PaginatedResponse<ApiLocation>);
  });
});
