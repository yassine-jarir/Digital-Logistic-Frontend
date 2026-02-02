import { createReducer, on } from '@ngrx/store';
import { ProductsState, initialProductsState } from './products.state';
import * as ProductsActions from './products.actions';

export const productsReducer = createReducer(
  initialProductsState,
  
  // Load products
  on(ProductsActions.loadProducts, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: query || {}
  })),
  
  on(ProductsActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    items: products,
    loading: false,
    error: null
  })),
  
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Clear error
  on(ProductsActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
