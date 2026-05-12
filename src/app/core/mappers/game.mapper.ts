import { FilterOption, Game, GamesResponse, PlatformInfo } from '../models/game';
import {
  FilterOptionDto,
  GameDto,
  GamesResponseDto,
  PlatformInfoDto,
} from '../models/game.dto';

export function mapFilterOption(dto: FilterOptionDto): FilterOption {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    gamesCount: dto.games_count,
  };
}

function mapPlatformInfo(dto: PlatformInfoDto): PlatformInfo {
  return {
    platform: dto.platform,
    releasedAt: dto.released_at,
  };
}

export function mapGame(dto: GameDto): Game {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    released: dto.released,
    tba: dto.tba,
    backgroundImage: dto.background_image,
    rating: dto.rating,
    ratingTop: dto.rating_top,
    ratingsCount: dto.ratings_count,
    metacritic: dto.metacritic,
    playtime: dto.playtime,
    genres: dto.genres,
    platforms: (dto.platforms ?? []).map(mapPlatformInfo),
    shortScreenshots: dto.short_screenshots ?? [],
    description: dto.description_raw?.trim() || undefined,
  };
}

export function mapGamesResponse(dto: GamesResponseDto): GamesResponse {
  return {
    count: dto.count,
    next: dto.next,
    previous: dto.previous,
    results: dto.results.map(mapGame),
  };
}
