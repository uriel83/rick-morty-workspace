export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface PaginatedResponse<T> {
  info: ApiInfo;
  results: T[];
}

export interface LocationRef {
  name: string;
  url: string; // לעתים ריק מה־API, אבל הטייפ נשאר string
}

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: LocationRef;
  location: LocationRef;
  image: string;
  episode: string[];
  url: string;
  created: string; // ISO
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[]; // URLs
  url: string;
  created: string;
}
