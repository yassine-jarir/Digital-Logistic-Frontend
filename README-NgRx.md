# NgRx Implementation Overview (Frontend)

This README summarizes the NgRx state management introduced in the Angular frontend to streamline product data flow for client features (notably the sales order form). It explains the architecture, key pieces, and how components use the store.

## Why NgRx here
- Centralize product state used across multiple client pages
- Avoid duplicate calls and manual loading/error handling per component
- Keep components declarative: select data + dispatch intents
- Enable simple query-based filtering at the effect level

## Stack & Versions
- Angular: 21.x
- NgRx: 21.x (`@ngrx/store` and `@ngrx/effects`)

## Registration
The store and effects are provided in the root configuration:
- Store: feature key `clientProducts` registered in [src/app/app.config.ts](src/app/app.config.ts)
- Effects: `ProductsEffects` provided in [src/app/app.config.ts](src/app/app.config.ts)

```
provideStore({ clientProducts: productsReducer })
provideEffects([ProductsEffects])
```

## Feature: Client Products Store
Location: [src/app/features/client/pages/products/store](src/app/features/client/pages/products/store)

### State
File: [products.state.ts](src/app/features/client/pages/products/store/products.state.ts)
- `items: Product[]` — product list
- `loading: boolean` — fetch in progress
- `error: string | null` — last error message
- `query: { search?: string; category?: string; active?: boolean }` — client-side filters

### Actions
File: [products.actions.ts](src/app/features/client/pages/products/store/products.actions.ts)
- `loadProducts({ query })` — start loading with optional filters
- `loadProductsSuccess({ products })` — set items on success
- `loadProductsFailure({ error })` — capture error
- `clearError()` — clear error state

### Reducer
File: [products.reducer.ts](src/app/features/client/pages/products/store/products.reducer.ts)
- Handles load lifecycle; stores `query`, toggles `loading`, sets `items` or `error`
- Pure state transitions, no side effects

### Effects
File: [products.effects.ts](src/app/features/client/pages/products/store/products.effects.ts)
- `loadProducts$`: listens to `loadProducts`, calls `ProductService.getAllProducts()`
- Applies client-side filtering for `search`, `category`, `active`
- Dispatches `loadProductsSuccess` or `loadProductsFailure`

### Selectors
File: [products.selectors.ts](src/app/features/client/pages/products/store/products.selectors.ts)
- `selectAllProducts`: all items
- `selectActiveProducts`: items where `active === true`
- `selectProductsLoading`: loading flag
- `selectProductsError`: error text
- `selectProductsQuery`: current query
- `selectProductById(id)`: find one by id

## Component Usage

### Products Page
Files: 
- [products.component.ts](src/app/features/client/pages/products/products.component.ts)
- [products.component.html](src/app/features/client/pages/products/products.component.html)

Key pattern:
```ts
constructor(private store: Store) {
  this.products$ = this.store.select(ProductsSelectors.selectAllProducts);
  this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
}

ngOnInit() {
  this.store.dispatch(ProductsActions.loadProducts({ query: { active: true } }));
}
```

### Sales Order Create Form
File: [sales-order-create.component.ts](src/app/features/client/pages/sales-orders/sales-order-create.component.ts)
- Dispatches `loadProducts({ query: { active: true } })` on init
- Selects `selectActiveProducts`, `selectProductsLoading`, `selectProductsError`
- On product selection, uses `selectProductById(id)` to prefill `unitPrice`

## Design Notes
- Kept simple: one feature store focused on products; no facades
- Client-side filtering keeps backend API simple while supporting UI queries
- Errors are handled at effect level and exposed via selectors
- SSR hydration with event replay is enabled in [src/app/app.config.ts](src/app/app.config.ts)

## Extending Later
- Add `@ngrx/entity` for normalized product state and performant selectors
- Cache by query (memoize results or store last response per filter)
- Add pagination and sorting support
- Unit test effects and reducer with Marble tests / Jest/Vitest

## Quick Reference
- Store key: `clientProducts`
- Files: actions, reducer, effects, selectors, state under products `store/`
- Registered in: [src/app/app.config.ts](src/app/app.config.ts)
- Consumed by: products page and sales order create form

For a feature-level walkthrough, see the in-place doc at [src/app/features/client/pages/products/README.md](src/app/features/client/pages/products/README.md).
