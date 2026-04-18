export interface GamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  tba: boolean;
  backgroundImage: string | null;
  rating: number;
  ratingTop: number;
  ratingsCount: number;
  metacritic: number | null;
  playtime: number;
  genres: Genre[];
  platforms: PlatformInfo[];
  shortScreenshots: Screenshot[];
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface PlatformInfo {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
  releasedAt: string | null;
}

export interface Screenshot {
  id: number;
  image: string;
}
