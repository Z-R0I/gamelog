<div align="center">

# 🎮 Gamelog

**Catálogo moderno de videojuegos con sistema de favoritos persistente.**

Frontend portfolio piece showcasing Angular 20 patterns: signals, `httpResource`, view transitions, SWR caching, reactive forms with typed `FormControl`, and modern UI/UX.

### 🌐 [Live demo →](https://gamelog-omega.vercel.app/)

[![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![RxJS](https://img.shields.io/badge/RxJS-7-B7178C?logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)](https://gamelog-omega.vercel.app/)

</div>

---

## ✨ Características

- **Catálogo paginado** con infinite scroll vía `IntersectionObserver`
- **Hero carousel** con autoplay, pause-on-hover, dots indicator y CSS transitions
- **Búsqueda reactiva** con `FormGroup` tipado + debounce + `switchMap` (cancela requests obsoletas)
- **Filtros combinados**: género, plataforma (agrupada), ordenación
- **Sistema de favoritos** con patrón SWR (Stale-While-Revalidate) y persistencia `localStorage`
- **Modal detalle** con `<dialog>` nativo, animación `@starting-style`, focus trap automático
- **Ambient background** animado con gradient mesh y noise overlay
- **Spotlight cursor-follow** glow en cards
- **Scroll reveal** animations vía `IntersectionObserver`
- **View Transitions API** entre rutas (Chrome 111+)
- **Dark mode** consistente con paleta violet/fuchsia brand
- **Responsive** desde mobile a desktop wide
- **A11y**: ARIA roles, `:focus-visible`, `aria-pressed`, `aria-current`, `prefers-reduced-motion`

---

## 🛠 Stack

| Capa | Tech |
|---|---|
| Framework | Angular 20 (standalone components, signals API) |
| Lenguaje | TypeScript 5.8 (strict) |
| Estilos | Tailwind CSS v4 + custom CSS (`@layer components`) |
| Estado | Signals + `computed` + `effect` (sin NgRx) |
| HTTP | `HttpClient` + `httpResource` (Angular 20) |
| Reactivo | RxJS 7 (`forkJoin`, `switchMap`, `debounceTime`, `Subject`) |
| Routing | Router con `withComponentInputBinding` + `withViewTransitions` |
| Forms | Reactive Forms tipados (`FormControl<T>`) |
| API datos | [RAWG.io](https://rawg.io/apidocs) |

---

## 🧩 Patrones Angular 20 demostrados

### Signals architecture
- **`signal<T>()`** como única fuente de estado
- **`computed()`** para derivaciones puras (filtered lists, validations)
- **`effect()`** para sincronización con localStorage y DOM imperativo (`<dialog>`)
- **`linkedSignal()`** y reset de estado derivado al cambiar inputs
- **`input.required<T>()`** y **`output<T>()`** API moderna sin decoradores

### Resource API
```ts
protected resource = this.rawg.gameByIdResource(() => this.numericId());
// auto refetch on dependency change
// .value(), .isLoading(), .error(), .reload()
```

### SWR cache (Stale-While-Revalidate)
- `FavoriteService` guarda `Record<number, Game>` en signal
- `effect` persiste cambios en `localStorage`
- `refresh()` usa `forkJoin` paralelo + `catchError` per-request → mantiene cache stale si falla individual
- UI pinta cache instant + refresh background

### Reactive search pipeline
```ts
form.valueChanges.pipe(
  debounceTime(400),
  distinctUntilChanged(customComparator),
  switchMap(filters => rawg.getGames(filters))  // cancels in-flight
)
```

### Custom directives standalone
- `appInfiniteScroll` — `IntersectionObserver` + `afterNextRender` + `DestroyRef`
- `appSpotlight` — pointer events → CSS custom properties
- `appRevealOnScroll` — fade-up one-shot reveal con `unobserve()`

### Native modal (`<dialog>`)
- `showModal()` / `close()` triggered via `effect` reading signal
- `@starting-style` CSS animation entrance (modern Chrome/Safari/FF)
- `::backdrop` blur + dim
- Focus trap automático (browser-native)
- Body scroll lock vía `DOCUMENT` token (SSR-safe)

---

## 🏗 Arquitectura

```
src/app/
├── core/
│   ├── models/         # Domain types (Game, FilterOption, ...)
│   ├── models/*.dto.ts # API DTOs (snake_case)
│   ├── mappers/        # DTO → Model transforms
│   └── services/       # RawgService, FavoriteService, GameDetailModalService
├── features/
│   ├── home/           # Hero carousel + multi-section grid
│   ├── search/         # Reactive form + filters + results
│   ├── favorites/      # Grid of cached favorites
│   └── game-detail/    # Standalone route + shared GameDetailContent + skeleton
├── layout/
│   ├── header/         # Sticky nav with active route indicator
│   └── footer/
└── shared/
    ├── game-card/      # Reusable card with spotlight + fav toggle
    ├── game-detail-modal/   # Global <dialog> + httpResource
    ├── ambient-background/  # Animated mesh gradient
    ├── star-icon/      # OnPush SVG component
    ├── spotlight/      # Directive
    ├── infinite-scroll/# Directive
    └── reveal-on-scroll/    # Directive
```

**Capas estrictas:** `features` y `layout` consumen `shared` y `core`. `core` no depende de UI. Mappers aíslan API shape de modelos internos.

---

## 🎯 Decisiones técnicas

| Decisión | Razón |
|---|---|
| Signals sobre NgRx | Estado simple, derivaciones reactivas, menor bundle, idiomatic Angular 20 |
| SWR sobre TanStack Query | Sin lib externa, demo de pattern manual con Angular primitives |
| `httpResource` sobre `HttpClient + signal` | API oficial Angular 20, refetch reactivo a deps automático |
| `<dialog>` nativo sobre CDK overlay | Focus trap gratis, `::backdrop` CSS, menor bundle |
| Modal global vs route page | Mejor UX (preserva grid behind), URL sync vía `Location.go`, fallback page para deep links |
| `parent_platforms` | Filtro agrupado más usable que individual (PS5/PS4/PS3...) |
| View Transitions API | Cross-route animations sin librería, native browser |
| Tailwind v4 con `@layer components` | DRY de patrones custom (`.nav-link`, `.shimmer`, `.spotlight-card`) sin perder cascade |

---

## 🚀 Setup local

```bash
# Clone
git clone https://github.com/Z-R0I/gamelog.git
cd gamelog

# Install
npm install

# Set RAWG API key
cp src/environments/environment.development.example.ts src/environments/environment.development.ts
# Edit rawgKey value (free key at https://rawg.io/apidocs)

# Dev server
npm start            # → http://localhost:4200

# Production build
npm run build        # → dist/gamelog
```

---

## 📦 Scripts

| Script | Descripción |
|---|---|
| `npm start` | Dev server con HMR |
| `npm run build` | Build optimizado producción |
| `npm run watch` | Build incremental development |
| `npm test` | Unit tests Karma + Jasmine |

---

## 🧠 Aprendizajes

- **Signals como state primitive** reemplazan limpiamente BehaviorSubject + async pipe
- **`effect` para puente declarativo/imperativo** (DOM `<dialog>.showModal()`, localStorage)
- **`switchMap` en formularios** previene race conditions en búsquedas rápidas
- **`@starting-style` + `allow-discrete`** permite animar `display: none ↔ block` y `<dialog>`
- **`IntersectionObserver` + unobserve one-shot** para reveal animations sin re-trigger
- **CSS custom properties driven by pointer events** = interactividad GPU-friendly sin re-renders

---

## 📄 Licencia

MIT — Santiago Soto.

Datos juegos vía [RAWG.io](https://rawg.io). No afiliado.
