import { Product } from '../../../../../core/models/product.model';

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  query: {
    search?: string;
    category?: string;
    active?: boolean;
  };
}

export const initialProductsState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  query: {}
};
