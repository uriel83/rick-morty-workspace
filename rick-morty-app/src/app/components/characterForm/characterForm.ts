import { Component, Input, signal, OnChanges, SimpleChanges, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CharactersService } from '../../services/characters.service';
import { FavoritesService } from '../../services/favorites.service';
import { Character } from '../../models/models';

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './characterForm.html',
  styleUrl: './characterForm.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterFormComponent implements OnChanges {
  @Input() character: Character | undefined;
  @Output() characterCreated = new EventEmitter<any>();

  locations = signal<any[]>([]);
  CHARACTER_STATUSES = ['Alive', 'Dead', 'unknown'];
  GENDERS = ['Female', 'Male', 'Genderless', 'unknown'];
  invalidImageUrl = false;
  pendingCharacter: Character | null = null;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private charactersService: CharactersService,
    private favorites: FavoritesService
  ) {
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      image: ['', Validators.required],
      gender: ['', Validators.required],
      status: ['', Validators.required],
      location: [null, Validators.required],
    });

    this.charactersService.getAllLocations().subscribe((res) => {
      this.locations.set(res);
      this.tryPatchCharacter();

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['character']?.currentValue) {
      this.pendingCharacter = changes['character'].currentValue;
    }
  }
  tryPatchCharacter() {
    if (!this.pendingCharacter) return;
    if (this.locations().length === 0) return;

    const value = this.pendingCharacter;
    const matchedLocation =
      this.locations().find(loc => loc.name === value.location?.name) ?? null;

    this.form.patchValue({
      id: value.id || null,
      name: value.name || '',
      image: value.image || '',
      gender: value.gender || '',
      status: value.status || '',
      location: matchedLocation,
    });

    this.invalidImageUrl = false;
    this.pendingCharacter = null;
  }

  onImageError() {
    this.invalidImageUrl = true;
  }

  onImageLoad() {
    this.invalidImageUrl = false;
  }

  onSubmit() {
    if (this.form.valid) {
      const character = this.form.value;
      this.characterCreated.emit(character);
    }
  }
}
