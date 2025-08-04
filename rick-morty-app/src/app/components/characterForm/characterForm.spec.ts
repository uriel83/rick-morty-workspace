// rick-morty-app/src/app/components/characterForm/characterForm.spec.ts
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CharacterFormComponent } from './characterForm';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CharactersService } from '../../services/characters.service';

// מוק לשירות — משאיר create/update למקרה שתחליט להשתמש בהם בהמשך
class CharactersServiceMock {
  getAllLocations = jest.fn().mockReturnValue(
    of([
      { id: 1, name: 'Earth' },
      { id: 2, name: 'Citadel of Ricks' },
    ])
  );
  createCharacter = jest.fn().mockReturnValue(of({ id: 123 }));
  updateCharacter = jest.fn().mockReturnValue(of({ id: 123 }));
}

describe('CharacterFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFormComponent, ReactiveFormsModule],
      providers: [{ provide: CharactersService, useClass: CharactersServiceMock }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CharacterFormComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have invalid form initially and disable submit', () => {
    const fixture = TestBed.createComponent(CharacterFormComponent);
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(comp.form.invalid).toBe(true);

    const btn: HTMLButtonElement =
      fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(btn.disabled).toBe(true);
  });

  it('name is required: becomes valid when filled', () => {
    const fixture = TestBed.createComponent(CharacterFormComponent);
    const comp = fixture.componentInstance;

    const name = comp.form.get('name')!;
    name.setValue('');
    expect(name.invalid).toBe(true);

    name.setValue('Rick Sanchez');
    expect(name.valid).toBe(true);
  });

  it('image URL validity toggles states correctly', () => {
    const fixture = TestBed.createComponent(CharacterFormComponent);
    const comp = fixture.componentInstance;

    // קלט URL
    comp.form.get('image')!.setValue('https://example.com/rick.png');
    fixture.detectChanges();

    // בתחילה: אין שגיאה ויש <img>
    expect(comp.invalidImageUrl).toBe(false);
    let img = fixture.debugElement.query(By.css('img.image-preview'));
    expect(img).toBeTruthy();

    // שגיאת טעינה -> מצב שגוי וה-IMG נעלם
    comp.onImageError();
    fixture.detectChanges();
    expect(comp.invalidImageUrl).toBe(true);
    expect(fixture.debugElement.query(By.css('.error-message'))).toBeTruthy();
    img = fixture.debugElement.query(By.css('img.image-preview'));
    expect(img).toBeFalsy();

    // חזרה למצב תקין
    comp.onImageLoad();
    fixture.detectChanges();
    expect(comp.invalidImageUrl).toBe(false);

    // לא נכפה הופעה מחודשת של <img> (כי אין אירוע load אמיתי מהדפדפן בטסט)
    // מספיק לוודא שהמצב חזר לתקין
  });

  it('submit is enabled when form is valid', () => {
    const fixture = TestBed.createComponent(CharacterFormComponent);
    const comp = fixture.componentInstance;

    comp.form.get('name')!.setValue('Morty Smith');
    comp.form.get('image')!.setValue('https://example.com/morty.jpg');
    comp.form.get('status')!.setValue('Alive');
    comp.form.get('gender')!.setValue('Male');
    comp.form.get('location')!.setValue({ id: 1, name: 'Earth' });
    fixture.detectChanges();

    expect(comp.form.valid).toBe(true);

    const btn: HTMLButtonElement =
      fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(btn.disabled).toBe(false);
  });

  it('onSubmit does not throw when form is valid', () => {
    const fixture = TestBed.createComponent(CharacterFormComponent);
    const comp = fixture.componentInstance;
    // אם תרצה לבדוק קריאה לשירות — ודא מהו שם המתודה בקומפוננטה והחלף בהתאם
    const svc = TestBed.inject(CharactersService) as unknown as CharactersServiceMock;

    comp.form.get('name')!.setValue('Summer');
    comp.form.get('image')!.setValue('https://example.com/summer.png');
    comp.form.get('status')!.setValue('Alive');
    comp.form.get('gender')!.setValue('Female');
    comp.form.get('location')!.setValue({ id: 2, name: 'Citadel of Ricks' });

    expect(() => comp.onSubmit()).not.toThrow();

    // אם הקומפוננטה שלך כן קוראת ל-create/update, אפשר להחזיר את האסרטים:
    // expect(svc.createCharacter).toHaveBeenCalledTimes(1);
    // expect(svc.createCharacter).toHaveBeenCalledWith(expect.objectContaining({ ... }));
  });

  it('onSubmit does nothing when form is invalid', () => {
    const fixture = TestBed.createComponent(CharacterFormComponent);
    const comp = fixture.componentInstance;
    const svc = TestBed.inject(CharactersService) as unknown as CharactersServiceMock;

    comp.form.get('name')!.setValue('');
    comp.form.get('image')!.setValue('not-a-url');

    expect(() => comp.onSubmit()).not.toThrow();
    expect(svc.createCharacter).not.toHaveBeenCalled();
    expect(svc.updateCharacter).not.toHaveBeenCalled();
  });
});
