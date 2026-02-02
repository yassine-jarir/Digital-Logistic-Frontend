import { createAction, props } from '@ngrx/store';
import { Product } from '../../../../../core/models/product.model';

// Load products
export const loadProducts = createAction(
  '[Client Products] Load Products',
  props<{ query?: { search?: string; category?: string; active?: boolean } }>()
);

export const loadProductsSuccess = createAction(
  '[Client Products] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  '[Client Products] Load Products Failure',
  props<{ error: string }>()
);

// Clear error
export const clearError = createAction('[Client Products] Clear Error');
