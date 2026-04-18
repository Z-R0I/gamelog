import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GamesResponse } from '../models/game';
import { GamesResponseDto } from '../models/game.dto';
import { mapGamesResponse } from '../mappers/game.mapper';

@Injectable({ providedIn: 'root' })
export class RawgService {
  private http = inject(HttpClient);

  public getGames(): Observable<GamesResponse> {
    const url = `${environment.apiBase}/games`;
    let params = new HttpParams();
    if (environment.rawgKey) {
      params = params.set('key', environment.rawgKey);
    }

    return this.http
      .get<GamesResponseDto>(url, { params })
      .pipe(map(mapGamesResponse));
  }
}
