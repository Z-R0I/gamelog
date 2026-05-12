import { HttpClient, HttpParams, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Game, GamesResponse } from '../models/game';
import { GameDto, GamesResponseDto } from '../models/game.dto';
import { mapGame, mapGamesResponse } from '../mappers/game.mapper';

export interface GamesQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class RawgService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBase;

  public getGames(query: GamesQuery = {}): Observable<GamesResponse> {
    let params = this.buildParams();
    if (query.page) params = params.set('page', String(query.page));
    if (query.pageSize) params = params.set('page_size', String(query.pageSize));
    if (query.search?.trim()) params = params.set('search', query.search.trim());

    return this.http
      .get<GamesResponseDto>(`${this.baseUrl}/games`, { params })
      .pipe(map(mapGamesResponse));
  }

  public getGameById(id: number): Observable<Game> {
    return this.http
      .get<GameDto>(`${this.baseUrl}/games/${id}`, { params: this.buildParams() })
      .pipe(map(mapGame));
  }

  public gameByIdResource(
    idFn: () => number | null,
  ): HttpResourceRef<Game | undefined> {
    return httpResource<Game | undefined>(
      () => {
        const id = idFn();
        if (id === null) return undefined;
        return {
          url: `${this.baseUrl}/games/${id}`,
          params: this.buildParamsRecord(),
        };
      },
      {
        defaultValue: undefined,
        parse: (raw) => mapGame(raw as GameDto),
      },
    );
  }

  private buildParams(): HttpParams {
    let params = new HttpParams();
    if (environment.rawgKey) params = params.set('key', environment.rawgKey);
    return params;
  }

  private buildParamsRecord(): Record<string, string> {
    return environment.rawgKey ? { key: environment.rawgKey } : {};
  }
}
