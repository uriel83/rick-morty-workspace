import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  const store: Record<string, string> = {};

  beforeEach(() => {
    for (const k of Object.keys(store)) delete store[k];

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (k: string) => (k in store ? store[k] : null),
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { for (const k of Object.keys(store)) delete store[k]; },
      },
      writable: true,
    });

    TestBed.configureTestingModule({ providers: [FavoritesService] });
    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getFavorites loads from storage', () => {
    window.localStorage.setItem('favorites', JSON.stringify([7, 8]));
    service.getFavorites();
    expect(service.favoritesList()).toEqual([7, 8]);
  });
});
