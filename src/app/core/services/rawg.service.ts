import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Game, GamesResponse } from '../models/game';
import { GameDto, GamesResponseDto } from '../models/game.dto';
import { mapGame, mapGamesResponse } from '../mappers/game.mapper';

@Injectable({ providedIn: 'root' })
export class RawgService {
  private http = inject(HttpClient);

  public getGames(): Observable<GamesResponse> {
    const url = `${environment.apiBase}/games`;
    return this.http
      .get<GamesResponseDto>(url, { params: this.buildParams() })
      .pipe(map(mapGamesResponse));
  }

  public getGameById(id: number): Observable<Game> {
    const url = `${environment.apiBase}/games/${id}`;
    return this.http
      .get<GameDto>(url, { params: this.buildParams() })
      .pipe(map(mapGame));
  }

  private buildParams(): HttpParams {
    let params = new HttpParams();
    if (environment.rawgKey) {
      params = params.set('key', environment.rawgKey);
    }
    return params;
  }
}
