# NgRx f l Project — Chra7 b Darija

Had l-guide kaychra7 b Darija kifach darna NgRx f had l‑project, bach t9dr t9oul l‑formateur b wa93i3 chno kidayr w fin.

## Chno hwa NgRx?
- NgRx howa state management library l Angular, kaykhdem b pattern dyal Redux.
- Kay3awn f tahkim f l‑state b tari9a predictible: `Actions` → `Reducer` → `Store`, w `Effects` bach ndiro calls l API.

## Fin tsajal Store f project?
- F [src/app/app.config.ts](src/app/app.config.ts#L11-L14) tsajelna NgRx b `provideStore` w `provideEffects` (standalone APIs dyal Angular).
- Dna l reducer dyal products b key: `clientProducts`:
  - [app.config.ts](src/app/app.config.ts#L32) kay3ayet: `provideStore({ clientProducts: productsReducer })`
  - [app.config.ts](src/app/app.config.ts#L13-L14) kayzid `ProductsEffects` f `provideEffects([ProductsEffects])`

## Structure dyal Feature: Products
- Actions: [products.actions.ts](src/app/features/client/pages/products/store/products.actions.ts)
  - `loadProducts({ query })`: kaybda l‑loading.
  - `loadProductsSuccess({ products })`: ila jbou3na data.
  - `loadProductsFailure({ error })`: ila t9a3 error.
  - `clearError()`: nfasskho l‑error.
- State + Reducer: [products.state.ts](src/app/features/client/pages/products/store/products.state.ts) w [products.reducer.ts](src/app/features/client/pages/products/store/products.reducer.ts)
  - `ProductsState`: `{ items: Product[], loading: boolean, error: string|null, query: {...} }`.
  - Reducer kay7adeth `loading`, `items`, `error` 7asb l‑action.
- Effects: [products.effects.ts](src/app/features/client/pages/products/store/products.effects.ts)
  - Kaytsenna `loadProducts` b `ofType`.
  - Kaynadi `ProductService.getAllProducts()`.
  - Kaydir filtrage client‑side 7asb `query` (`search`, `category`, `active`).
  - Kaydispatchi `loadProductsSuccess` wla `loadProductsFailure`.
- Selectors: [products.selectors.ts](src/app/features/client/pages/products/store/products.selectors.ts)
  - `selectProductsState = createFeatureSelector('clientProducts')` (mohim: nafes key li f `provideStore`).
  - `selectAllProducts`, `selectProductsLoading`, `selectProductsError`, `selectProductsQuery`.
  - Derived: `selectActiveProducts`, `selectProductById(id)`.

## Kifach tsstahl Store f Component?
Example men `Sales Order Create`:
- F [sales-order-create.component.ts](src/app/features/client/pages/sales-orders/sales-order-create.component.ts#L58) injectina `Store`.
- F [sales-order-create.component.ts](src/app/features/client/pages/sales-orders/sales-order-create.component.ts#L60-L62) kancollectiw:
  - `products$ = store.select(ProductsSelectors.selectActiveProducts)`
  - `productsLoading$ = store.select(ProductsSelectors.selectProductsLoading)`
  - `productsError$ = store.select(ProductsSelectors.selectProductsError)`
- F [sales-order-create.component.ts](src/app/features/client/pages/sales-orders/sales-order-create.component.ts#L132) kandispatchiw:
  - `store.dispatch(loadProducts({ query: { active: true } }))` bach njibo gheir `active` products.
- F [sales-order-create.component.ts](src/app/features/client/pages/sales-orders/sales-order-create.component.ts#L144) kanst3mlo selector parametrized:
  - `store.select(selectProductById(item.productId))` bach njibo chi product m3ayen.

## 3lach khtrna NgRx?
- Predictible flow: kol haja katdwoz mn `Action` → `Reducer` → `Store`.
- Separation of concerns: API calls f `Effects`, state updates f `Reducer`, UI f components.
- Easy testing w debugging (selectors, reducers, effects qabelin l‑tests).

## Naming w Conventions
- Feature key darori ykon we7ed: hna `clientProducts` (tsjelt f `provideStore`).
- `createAction` b label mfhom: `"[Client Products] ..."` bach tkoun logs w devtools wadi.
- `createFeatureSelector('clientProducts')` khasso ymatchi m3a key.

## Kifach tzid Feature jdid?
1. Sna3 `store/` folder f feature (actions, reducer, selectors, effects, state).
2. Sjal reducer f [app.config.ts](src/app/app.config.ts#L32) b key jdid (ex: `{ warehouse: warehouseReducer }`).
3. Sjal effects f [app.config.ts](src/app/app.config.ts#L13-L14) (ex: `provideEffects([ProductsEffects, WarehouseEffects])`).
4. St3mel `store.select(...)` w `store.dispatch(...)` f components.

## Erreurs li t9dro ywa9folek
- Key mismatch: ila `createFeatureSelector('clientProducts')` w key f `provideStore` mkaynch b nafes smiya, selectors maykhdmush.
- Manzidnash `Effects`: `loadProducts` ghayb9a b7alha bla API call.
- Forget `props`: ila ma3raftish `props` f `createAction`, dispatch ghaytla3 error.

## Try It
- Run app:
```bash
npm start
```
- F page dyal Sales Order Create, hna ghatchof `products$` katsst3mel selectors w dispatch `loadProducts`.

## Quick Q&A l‑formateur
- S: Fin tsajel Store?
  - ج: F `app.config.ts` b `provideStore` w `provideEffects`.
- S: Kifach katjib data?
  - ج: `loadProducts` → `Effects` kaynadi `ProductService` → `Success/Failure`.
- S: Kifach kat9ra data f component?
  - ج: `store.select(selector)` w `async` f template, w dispatch actions bach tbdel state.

Haka katkon 3andek tlakhit mfhom b project dyalna, bach t9dr tjawb b ti9a 3la NgRx f‑had l‑setup.
