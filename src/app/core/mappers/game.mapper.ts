import { Game, GamesResponse, PlatformInfo } from '../models/game';
import { GameDto, GamesResponseDto, PlatformInfoDto } from '../models/game.dto';

function mapPlatformInfo(dto: PlatformInfoDto): PlatformInfo {
  return {
    platform: dto.platform,
    releasedAt: dto.released_at,
  };
}

function mapGame(dto: GameDto): Game {
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
    platforms: dto.platforms.map(mapPlatformInfo),
    shortScreenshots: dto.short_screenshots,
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
