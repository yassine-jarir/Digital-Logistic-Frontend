import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../../../core/models/product.model';
import * as ProductsActions from './store/products.actions';
import * as ProductsSelectors from './store/products.selectors';

@Component({
  selector: 'app-client-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ClientProductsComponent implements OnInit, OnDestroy {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  searchText = '';
  selectedCategory = '';
  showActiveOnly = true;
  
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.products$ = this.store.select(ProductsSelectors.selectAllProducts);
    this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
    this.error$ = this.store.select(ProductsSelectors.selectProductsError);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.store.dispatch(
      ProductsActions.loadProducts({
        query: {
          search: this.searchText || undefined,
          category: this.selectedCategory || undefined,
          active: this.showActiveOnly
        }
      })
    );
  }

  onSearch(): void {
    this.loadProducts();
  }

  onFilterChange(): void {
    this.loadProducts();
  }

  clearError(): void {
    this.store.dispatch(ProductsActions.clearError());
  }

  trackByProductId(index: number, product: Product): number {
    return product.id || index;
  }
}
