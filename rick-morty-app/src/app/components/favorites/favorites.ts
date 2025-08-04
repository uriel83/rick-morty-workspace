import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CharacterCardComponent } from 'libs/ui/src/lib/character-card/character-card';
import { PopupComponent } from 'libs/ui/src/lib/popup/popup.component';
import { CharactersService } from '../../services/characters.service';
import { FavoritesService } from '../../services/favorites.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Character } from '../../models/models';

@Component({
  selector: 'app-favorites',
  imports: [PopupComponent, CharacterCardComponent],
  standalone: true,
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent {
  charactersFavorites = signal<Character[]>([]);
  favoritesList = computed(() => this.favorites.favoritesList());

  showPopup = false;

  constructor(
    private charactersService: CharactersService,
    private favorites: FavoritesService
  ) {}

  openPopup(): void {
    this.showPopup = true;

    const ids = this.favoritesList();
    if (!ids.length) {
      this.charactersFavorites.set([]);
      return;
    }

    const requests = ids.map(id =>
      this.charactersService.getCharacterById(id).pipe(
        catchError(() => of(null))
      )
    );

    forkJoin(requests).subscribe((results) => {
      const filtered = results.filter((c): c is Character => c !== null);
      this.charactersFavorites.set(filtered);
    });
  }

  removeFromFavorites(id: number){
    this.favorites.removeFromFavorites(id)
    const updated = this.charactersFavorites().filter(c => c.id !== id);
    this.charactersFavorites.set(updated);
  }
}

