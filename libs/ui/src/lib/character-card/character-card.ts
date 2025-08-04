import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'lib-character-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './character-card.html',
  styleUrl: './character-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterCardComponent {
  @Input() character!: CharacterLike;
  @Input() isFavorite = false;
  @Input() action = false;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<boolean>();

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  onToggleFavorite() {
    this.toggleFavorite.emit(this.isFavorite);
  }
}

interface CharacterLike {
  id: number;
  name: string;
  image: string;
  status: string;
  gender: string;
  location: { name: string };
}
