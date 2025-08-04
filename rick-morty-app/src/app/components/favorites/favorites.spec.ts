// rick-morty-app/src/app/components/favorites/favorites.spec.ts
import { TestBed } from '@angular/core/testing';
import { FavoritesService } from '../../services/favorites.service';
import { CharactersService } from '../../services/characters.service';
import { of } from 'rxjs';
import { FavoritesComponent } from './favorites';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let favorites: FavoritesService;

  const charactersServiceMock: Partial<CharactersService> = {
    getCharacterById: (id: number) =>
      of({ id, name: `Char ${id}` } as any)
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        { provide: CharactersService, useValue: charactersServiceMock }
      ]
    });

    favorites = TestBed.inject(FavoritesService);
    component = new FavoritesComponent(
      TestBed.inject(CharactersService),
      favorites
    );
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('addToFavorites updates service signal and component computed list', async () => {
    favorites.addToFavorites(1);
    await Promise.resolve();

    expect(favorites.favoritesList()).toEqual([1]);
    expect(component.favoritesList()).toEqual([1]);
  });

  it('removeFromFavorites updates service signal and component computed list', async () => {
    favorites.addToFavorites(1);
    favorites.addToFavorites(2);
    await Promise.resolve();

    favorites.removeFromFavorites(1);
    await Promise.resolve();

    expect(favorites.favoritesList()).toEqual([2]);
    expect(component.favoritesList()).toEqual([2]);
  });

  it('openPopup with favorites loads characters into charactersFavorites', (done) => {
    favorites.addToFavorites(7);
    favorites.addToFavorites(8);

    component.openPopup();

    setTimeout(() => {
      const chars = component.charactersFavorites();
      expect(chars.map(c => c.id)).toEqual([7, 8]);
      done();
    }, 0);
  });

  it('removeFromFavorites (via component) removes character from list and service', async () => {
    favorites.addToFavorites(1);
    favorites.addToFavorites(2);
    await Promise.resolve();

    component['charactersFavorites'].set([
      { id: 1, name: 'Char 1' } as any,
      { id: 2, name: 'Char 2' } as any
    ]);

    component.removeFromFavorites(1);
    await Promise.resolve();

    expect(component.charactersFavorites().map(c => c.id)).toEqual([2]);
    expect(favorites.favoritesList()).toEqual([2]);
  });
});
