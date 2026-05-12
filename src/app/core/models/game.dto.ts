import { Genre, Screenshot } from './game';

export interface FilterOptionDto {
  id: number;
  name: string;
  slug: string;
  games_count: number;
}

export interface FilterOptionsResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: FilterOptionDto[];
}

export interface PlatformInfoDto {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
  released_at: string | null;
}

export interface GameDto {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  tba: boolean;
  background_image: string | null;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number | null;
  playtime: number;
  genres: Genre[];
  platforms: PlatformInfoDto[];
  short_screenshots: Screenshot[];
  description_raw?: string;
  description?: string;
}

export interface GamesResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: GameDto[];
}
