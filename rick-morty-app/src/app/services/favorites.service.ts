import { Injectable, signal, effect } from '@angular/core';

const FAVORITES_KEY = 'favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  favoritesList = signal<number[]>(
    JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')
  );

  private persist = effect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favoritesList()));
  });

  addToFavorites(id: number): void {
    this.favoritesList.update(list =>
      list.includes(id) ? list : [...list, id]
    );
  }

  removeFromFavorites(id: number): void {
    this.favoritesList.update(list => list.filter(f => f !== id));
  }

  getFavorites(): void {
    const data = localStorage.getItem(FAVORITES_KEY);
    this.favoritesList.set(data ? JSON.parse(data) : []);
  }

  isFavorite(id: number): boolean {
    return this.favoritesList().includes(id);
  }
}
