import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from '../../../../../api/product.service';
import * as ProductsActions from './products.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(({ query }) =>
        this.productService.getAllProducts().pipe(
          map((products) => {
            // Apply client-side filtering if query params exist
            let filtered = products;
            
            if (query?.search) {
              const searchLower = query.search.toLowerCase();
              filtered = filtered.filter(p => 
                p.name?.toLowerCase().includes(searchLower) ||
                p.sku?.toLowerCase().includes(searchLower) ||
                p.description?.toLowerCase().includes(searchLower)
              );
            }
            
            if (query?.category) {
              filtered = filtered.filter(p => p.category === query.category);
            }
            
            if (query?.active !== undefined) {
              filtered = filtered.filter(p => p.active === query.active);
            }
            
            return ProductsActions.loadProductsSuccess({ products: filtered });
          }),
          catchError((error) =>
            of(
              ProductsActions.loadProductsFailure({
                error: error?.message || 'Failed to load products'
              })
            )
          )
        )
      )
    )
  );
}
