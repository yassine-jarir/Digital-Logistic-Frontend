import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.state';

export const selectProductsState = createFeatureSelector<ProductsState>('clientProducts');

export const selectAllProducts = createSelector(
  selectProductsState,
  (state) => state.items
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state.loading
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state) => state.error
);

export const selectProductsQuery = createSelector(
  selectProductsState,
  (state) => state.query
);

export const selectActiveProducts = createSelector(
  selectAllProducts,
  (products) => products.filter(p => p.active)
);

export const selectProductById = (id: number) =>
  createSelector(selectAllProducts, (products) =>
    products.find(p => p.id === id)
  );
