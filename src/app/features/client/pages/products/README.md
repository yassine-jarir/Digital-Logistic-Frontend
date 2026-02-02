# Client Products Feature with NgRx

This directory contains the client products feature with NgRx state management.

## Structure

```
products/
├── store/
│   ├── products.state.ts      # State interface and initial state
│   ├── products.actions.ts    # Actions for loading products
│   ├── products.reducer.ts    # Reducer handling state updates
│   ├── products.effects.ts    # Effects for API calls
│   ├── products.selectors.ts  # Selectors for accessing state
│   └── index.ts               # Barrel export
├── products.component.ts      # Main UI component
├── products.component.html    # Template
└── products.component.css     # Styles
```

## Features

### State Management
- **Loading state**: Tracks when products are being fetched
- **Error handling**: Captures and displays API errors
- **Query support**: Filters by search text, category, and active status

### Actions
- `loadProducts` - Initiates product loading with optional query filters
- `loadProductsSuccess` - Handles successful data fetch
- `loadProductsFailure` - Handles API errors
- `clearError` - Clears error messages

### Selectors
- `selectAllProducts` - All products from state
- `selectActiveProducts` - Filtered active products only
- `selectProductsLoading` - Loading indicator
- `selectProductsError` - Error message
- `selectProductById(id)` - Find specific product by ID

### UI Component
- Search by name, SKU, or description
- Filter by category
- Show active products only toggle
- Responsive grid layout
- Loading and error states
- Empty state handling

## Usage

### Navigate to Products Page
```
/client/products
```

### Using the Store in Other Components

```typescript
import { Store } from '@ngrx/store';
import * as ProductsActions from './pages/products/store/products.actions';
import * as ProductsSelectors from './pages/products/store/products.selectors';

constructor(private store: Store) {}

// Load products
this.store.dispatch(ProductsActions.loadProducts({ query: { active: true } }));

// Select data
this.products$ = this.store.select(ProductsSelectors.selectAllProducts);
this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
```

## Integration

The store is registered globally in `app.config.ts`:
```typescript
provideStore({ clientProducts: productsReducer }),
provideEffects([ProductsEffects])
```

The sales order creation form now uses this store instead of directly calling ProductService.

## Notes

- Keep the store simple and focused on products data
- No facades or additional abstraction layers
- Effects handle all API communication
- Component subscribes to observables for reactive updates
