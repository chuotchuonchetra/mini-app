# Debugging Journal

### Bug 1: Uncaught TypeError (.map on null)
* **Symptom:** White screen crash on initial load.
* **Tool Used:** Sources Tab (Pause on Uncaught Exceptions).
* **What it Showed:** Pausing execution highlighted `products.map()`, showing `products` was `null` in the local scope.
* **Fix:** Replaced with `(products ?? []).map()` or `products?.map()`.

### Bug 2: Silent Render of Fallback Values (Prop Typo)
* **Symptom:** Product cards render without error, but all values display default fallback text.
* **Tool Used:** React DevTools (Components Panel).
* **What it Showed:** Inspecting `<ProductCard>` revealed the component received `itemData` prop instead of `product`.
* **Fix:** Corrected prop attribute in parent loop to `<ProductCard product={product} />`.

### Bug 3: Mock API Route Returns 404 Error
* **Symptom:** The page shows a red error banner: `HTTP Error 404: Failed to fetch products from /api/v1/productz_list`.
* **Tool Used:** Network Tab (Fetch/XHR filter) / Console async trace.
* **What it Showed:** Inspecting the failed request/promise response revealed the simulated endpoint path was mistyped as `/api/v1/productz_list` and resolved with status code `404`.
* **Fix:** Corrected the route resolution status code to `200` and returned valid `INITIAL_PRODUCTS` data payload.