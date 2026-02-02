# Tchra7 b Darija: Kifash Khddam Project u NgRx

Hna غادي نشرحو بواحد الطريقة ساده شنو دار فـ frontend ديال Angular، كيفاش استعملنا NgRx باش نتحكمو فالداتا ديال `products`, وفين دخلناه فصفحات بحال `Sales Order Create`. وغادي نعطيوك حتى كيفاش تشغل البروجي.

## L-Architecture
- **Frontend (Angular 21):** التطبيق كيدير SSR و hydration. Providers و routing و HTTP كاينين فهاد الملف: [src/app/app.config.ts](src/app/app.config.ts). الbase URL ديال API هو `http://localhost:9090/api`.
- **State (NgRx 21):** زدنا Store feature سميتو `clientProducts` ومسجّلناه ف[src/app/app.config.ts](src/app/app.config.ts). Effects ديال `ProductsEffects` مسجّلين حتى هوما نفس الملف.
- **Backend (Spring Boot):** السيرفر راه هنا: [Digital-Logistics-Spring-Boot-main](Digital-Logistics-Spring-Boot-main). فيه كنترولرات بزاف للـ Client/Admin/Warehouse… الفرونت كيهدر معاه عبر `:9090/api`.

## علاش NgRx
- باش نوحّدو الداتا ديال `products` ونستعملوها فصفحات مختلفة بلا ما نعاودو نعيطو كل مرة.
- نضبطو `loading` و `error` و `query` فمكان واحد.
- نخلو الcomponents تكون خفيفة: غير `select` و `dispatch`.

## Client Products Store (فين والملفات)
Path: [src/app/features/client/pages/products/store](src/app/features/client/pages/products/store)

- **State:** [products.state.ts](src/app/features/client/pages/products/store/products.state.ts)
  - `items: Product[]`, `loading: boolean`, `error: string | null`, `query: { search?, category?, active? }`
- **Actions:** [products.actions.ts](src/app/features/client/pages/products/store/products.actions.ts)
  - `loadProducts({ query })`, `loadProductsSuccess({ products })`, `loadProductsFailure({ error })`, `clearError()`
- **Reducer:** [products.reducer.ts](src/app/features/client/pages/products/store/products.reducer.ts)
  - كيبدل الstate بواحد الشكل نقي (بدون side-effects)
- **Effects:** [products.effects.ts](src/app/features/client/pages/products/store/products.effects.ts)
  - كيسمع لـ `loadProducts`, كينادي `ProductService.getAllProducts()`, وكيدير فلترة فلكلايان على `search`, `category`, `active`, ومن بعد كيبعث `success` ولا `failure`
- **Selectors:** [products.selectors.ts](src/app/features/client/pages/products/store/products.selectors.ts)
  - `selectAllProducts`, `selectActiveProducts`, `selectProductsLoading`, `selectProductsError`, `selectProductsQuery`, `selectProductById(id)`

## L-Flow ديال NgRx (خطوة بخطوة)
1. Component كيديسباتشي `loadProducts({ query: { active: true } })`.
2. Effect كيتفاعل، كينادي الخدمة ديال API ويرجع اللائحة.
3. Effect كيدير فلترة حسب `query`، ومن بعد كيديسباتشي `loadProductsSuccess` ولا `loadProductsFailure`.
4. Reducer كيحدّث الstate (`items`, `loading`, `error`, `query`).
5. Component كيقرا الداتا عبر `selectors` بحال `selectActiveProducts`.

## فين استعملناه فالواجهات
- **Products Page:** [src/app/features/client/pages/products/products.component.ts](src/app/features/client/pages/products/products.component.ts)
  - فـ `ngOnInit()` كنعيطو: `loadProducts({ active: true })`
  - كنقراو: `products$`, `loading$`, `error$`
- **Sales Order Create:** [src/app/features/client/pages/sales-orders/sales-order-create.component.ts](src/app/features/client/pages/sales-orders/sales-order-create.component.ts)
  - كنديسباتشو `loadProducts({ active: true })` باش نعمرّو select ديال البرودويات
  - كنستعملو `selectActiveProducts` باش نعرضو غير لي `active`
  - مني يختار user برودوي، كنستعملو `selectProductById(id)` باش نعمرّو `unitPrice` ديال لاين ديال الأوردر تلقائياً

## Interceptors واش كيديرو
- **authInterceptor:** كيزيد JWT فـ `Authorization` header لكل طلب.
- **errorInterceptor:** كيوحد شكل الأخطاء باش يتعرضو مزيان.
- **loadingInterceptor:** كيعطيك `loading` باش تورّي لوادر فالـ UI.

## كيفاش تشغّل البروجي
- **Frontend:**
```bash
cd /home/yassine/Downloads/crash-game-predictor-main/logistics-frontend
npm install
npm start
```
غادي يطلع على: `http://localhost:4200`

- **Backend (Maven Wrapper):**
```bash
cd /home/yassine/Downloads/crash-game-predictor-main/logistics-frontend/Digital-Logistics-Spring-Boot-main
./mvnw spring-boot:run
```

- **Backend (Docker Compose إلا موجود):**
```bash
cd /home/yassine/Downloads/crash-game-predictor-main/logistics-frontend/Digital-Logistics-Spring-Boot-main
docker-compose up
```

تأكد أن الباك خدام على `http://localhost:9090/api` حيث هادي مضبوطة ف[src/app/app.config.ts](src/app/app.config.ts).

## Design Notes
- Simple setup: Store واحد مخصص لـ products، بلا facades.
- فلترة فلكلايان باش مانعقّدو API.
- الأخطاء واللوادر متحكَّمين فيهم عبر NgRx.
- SSR hydration خدام ف[src/app/app.config.ts](src/app/app.config.ts).

## Future Enhancements
- ندخلو `@ngrx/entity` باش ننظمو الداتا ونسرّعو `selectors`.
- Cache حسب `query` (memoization).
- Pagination و sorting.
- Unit tests لـ effects/reducer ب Vitest/Jest.

## Talk Track (ديبريفينغ سريع 2-3 دقايق)
- الهدف: توحيد داتا ديال `products` باش صفحات بحال `Products` و `Sales Order Create` يشاركو نفس المصدر بلا تكرار نداءات.
- السيرورة: `dispatch → effect → service → reducer → selectors → component`.
- الفائدة: UI نظيف، `loading/error` consistent، وسهلة توسّع.
- أسئلة ممكنة:
  - علاش ماستعملتوش `@ngrx/entity`؟ لأن الفيتشر بسيط دابا؛ نقدر نزيدوه إلا زادت التعقيد.
  - علاش الفلترة فلكلايان؟ باش مانبدّلو API ونبقاو مرنين؛ الباك يقدر لاحقاً يدير query params.
  - كيفاش كتسير الأخطاء؟ عبر `loadProductsFailure` و `selectProductsError`، والـ `errorInterceptor` كيوحد الرسالة.

باش تزيد التفاصيل، راجع الدوك الكامل: [README-NgRx.md](README-NgRx.md) u [src/app/features/client/pages/products/README.md](src/app/features/client/pages/products/README.md).
