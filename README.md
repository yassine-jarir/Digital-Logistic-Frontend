# LogisticsFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

````markdown
# LogisticsFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

````

## Architecture & Security

- Stack: Angular 20 (standalone, lazy routes), RxJS, HttpClient, Reactive Forms.
- Security: JWT Access/Refresh via interceptors and guards.

### Interceptors
- AuthInterceptor: adds `Authorization: Bearer <accessToken>` to protected requests.
- RefreshTokenInterceptor: on `401` with expired access token, calls `/auth/refresh` and replays the request; if refresh fails, logs out and redirects to `/login`.
- ErrorInterceptor: parses standardized API errors `{timestamp,status,message,path,detail}` and surfaces them via `NotificationService`.

### Guards
- `authGuard`: allows route only if a valid access token exists; else redirects to `/login`.
- `roleGuard`: checks `route.data.role` against the current user role; on mismatch redirects to `/unauthorized`.

### Routing & Roles
- `/login` (public)
- `/client` (CLIENT)
- `/warehouse` (WAREHOUSE_MANAGER)
- `/admin` (ADMIN)
- `/**` → `NotFound`
Each protected route uses `canActivate: [authGuard, roleGuard]` with `data: { role: '<ROLE>' }`.

## API Services Mapping

- Auth
	- `POST /auth/login` → AuthService.login
	- `POST /auth/refresh` → AuthService.refresh
	- `POST /auth/logout` (optional) → AuthService.logout
- Products (`ProductService`)
	- `GET /products` (list/search/pagination)
	- `GET /products/:id`
	- `POST /products`, `PUT /products/:id`
	- `POST /products/:id/deactivate`, `DELETE /products/:id`
- Warehouses (`WarehouseService`)
	- `GET /warehouses`, `GET /warehouses/:id`
	- `POST /warehouses`, `PUT /warehouses/:id`, `DELETE /warehouses/:id`
- Inventory (`InventoryService`)
	- `GET /inventory?warehouseId=...&sku=...&category=...`
	- `GET /inventory/availability?productId=...&warehouseId=...`
- Inventory Movements (`InventoryMovementService`)
	- `GET /inventory-movements` (filters: date/type/warehouse/SKU)
	- `POST /inventory-movements` (INBOUND/OUTBOUND/ADJUSTMENT)
- Sales Orders (`SalesOrderService`)
	- `POST /sales-orders` (create)
	- `GET /sales-orders` (list with pagination/status/date filters)
	- `GET /sales-orders/:id` (detail)
	- `POST /sales-orders/:id/reserve`, `POST /sales-orders/:id/cancel`
- Shipments (`ShipmentService`)
	- `POST /shipments` (create for RESERVED orders)
	- `GET /shipments` (filters: orderId/status)
	- `GET /shipments/:id` (detail)
	- `POST /shipments/:id/status` (PLANNED → IN_TRANSIT → DELIVERED)
- Suppliers (`SupplierService`)
	- `GET /suppliers`, `GET /suppliers/:id`
	- `POST /suppliers`, `PUT /suppliers/:id`, `DELETE /suppliers/:id`
- Purchase Orders (`PurchaseOrderService`)
	- `POST /purchase-orders` (create)
	- `GET /purchase-orders`, `GET /purchase-orders/:id`
	- `POST /purchase-orders/:id/receive` (partial/total)
- Reporting (`ReportingService`)
	- `GET /reporting/kpis` (global KPIs)
	- `GET /reporting/client-kpis` (per-client KPIs)
- Users (`UserService`)
	- `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`
	- `POST /users/:id/activate`, `POST /users/:id/deactivate`

## Running the App

```bash
npm install
npm start
```

- API base URL is configurable via provider and defaults to `/api`.
- Demo accounts: `client@test.com`, `warehouse@test.com`, `admin@test.com` work without backend for quick validation.
# Digital-Logistic-Frontend
