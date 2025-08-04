import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CharactersService } from '../../services/characters.service';
import { CharacterCardComponent } from '../../../../../libs/ui/src/lib/character-card/character-card'; // אם קונפיגורציה תומכת
import { PopupComponent } from '../../../../../libs/ui/src/lib/popup/popup.component'; // אם קונפיגורציה תומכת
import { FavoritesService } from '../../services/favorites.service';
import { FavoritesComponent } from '../favorites/favorites';
import { CharacterFormComponent } from '../characterForm/characterForm';
import { Character } from '../../models/models';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CharacterCardComponent, PopupComponent, FavoritesComponent, CharacterFormComponent, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  characters = signal<Character[]>([]);
  favoritesList = computed(() => this.favorites.favoritesList());
  isFavorite = (id: number) => computed(() => this.favoritesList().includes(id));

  currentPage = 1;
  hasMore = true;
  isLoading = false;
  showPopupOnDelete = false;
  showPopupCharacterForm = false;

  selectedCharacterToDelete: Character | null = null;
  selectedCharacterToEdit: Character | null = null;

  constructor(private charactersService: CharactersService, private favorites: FavoritesService) {}

  ngOnInit(): void {
    this.favorites.getFavorites()
    this.loadCharacters();
    window.addEventListener('scroll', this.onScroll, true);
  }

  loadCharacters(): void {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;

    this.charactersService.getCharactersByPage(this.currentPage).subscribe({
      next: (res) => {
        this.characters.update(prev => [...prev, ...res.results]);
        console.log(this.characters());

        this.currentPage++;
        this.hasMore = !!res.info.next;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('error: ', err);
        this.isLoading = false;
      }
    });
  }

  getFavorite(characterId: number): boolean {
    return this.favoritesList().includes(characterId);
  }

  onEdit(character: Character) {
    console.log('Edit', character);
    this.selectedCharacterToEdit = character
    this.showPopupCharacterForm = true;
  }

  onDelete(character: Character) {
    this.showPopupOnDelete = true;
    this.selectedCharacterToDelete = character
    console.log('Delete', character);
  }

  confirmDelete(approve: boolean) {
    if (approve && this.selectedCharacterToDelete) {
      const id = this.selectedCharacterToDelete.id;
      this.characters.update(chars => chars.filter(c => c.id !== id));
      this.favorites.removeFromFavorites(id);
    }
    this.selectedCharacterToDelete = null;
    this.showPopupOnDelete = false;
  }


  onToggleFavorite(isFavorite: boolean, character: Character) {
    console.log('Favorite', character);
    console.log('isFavorite', isFavorite);

    if (isFavorite) {
      this.favorites.removeFromFavorites(character.id);
    } else {
      this.favorites.addToFavorites(character.id);
    }

  }


  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll, true);
  }

  onScroll = (): void => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const bottom = document.body.offsetHeight - 200;

    if (scrollPosition >= bottom) {
      this.loadCharacters();
    }
  };

  confirmCharacterForm(){
    this.showPopupCharacterForm = false;
  }

  addNewCharacter(){
    console.log('new');
    this.selectedCharacterToEdit = null
    this.showPopupCharacterForm = true

  }

  onCharacterAdded(character: Character): void {
    console.log('New character received from child:', character);
    const list = this.characters();

    if (character?.id != null) {
      const idx = list.findIndex(c => c.id === character.id);
      if (idx > -1) {
        const updated = [...list];
        updated[idx] = { ...updated[idx], ...character };
        this.characters.set(updated);
        this.showPopupCharacterForm = false;
        return;
      }
    }

    const withId = { ...character, id: Date.now() };
    this.characters.set([withId, ...list]);
    this.showPopupCharacterForm = false;
  }



}
