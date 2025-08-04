# Rick and Morty Character Collection

Angular app for managing Rick & Morty characters: API loading, local create/edit, favorites (LocalStorage), infinite scroll, and a small UI library.

## Features
- Angular **Standalone** + **Signals** (`signal`, `computed`, `effect`)
- RxJS: `switchMap`, `forkJoin`, `catchError`
- **Reactive Forms** with image preview & location select
- **Favorites** with LocalStorage persistence
- **Infinite Scroll**
- UI: `PopupComponent`, `CharacterCardComponent`
- Strong typing: `Character`, `Location`, `PaginatedResponse<T>`

## Architecture (incl. tests)
  apps/rick-morty-app/src/app/
  app.(ts|html|scss|spec.ts)
  components/
  home/ home.(ts|html|scss|spec.ts)
  favorites/ favorites.(ts|html|scss|spec.ts)
  characterForm/ characterForm.(ts|html|scss|spec.ts)
  services/
  characters.service.(ts|spec.ts)
  favorites.service.(ts|spec.ts)
  models/models.ts
  libs/ui/src/lib/
  popup/ popup.component.(ts|html|scss)


## Install & Run
  ```bash
  npm i
  npx nx serve rick-morty-app         # dev
  npx nx build rick-morty-app         # build
  npx nx test rick-morty-app          # tests

Notes
OnPush change detection + Signals for efficient state updates.
Favorites are stored via an effect that auto-saves to LocalStorage.
All unit tests pass in the final run.

