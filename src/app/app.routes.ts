import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search').then((m) => m.Search),
  },
  {
    path: 'game/:id',
    loadComponent: () =>
      import('./features/game-detail/game-detail').then((m) => m.GameDetail),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites').then((m) => m.Favorites),
  },
  { path: '**', redirectTo: '' },
];
