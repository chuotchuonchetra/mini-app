import * as React from "react";
import { useState } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  onSale: boolean;
}

export interface ProductFormState {
  name: string;
  price: string;
  inStock: boolean;
  onSale: boolean;
}

export interface FormErrors {
  name?: string;
  price?: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "prod-101", name: "Wireless Mechanical Keyboard", price: 89.99, inStock: true, onSale: true },
  { id: "prod-102", name: "Ergonomic Vertical Mouse", price: 45.0, inStock: true, onSale: false },
  { id: "prod-103", name: "Ultra-Wide Gaming Monitor", price: 349.99, inStock: false, onSale: true },
  { id: "prod-104", name: "Active Noise-Cancelling Headphones", price: 179.99, inStock: true, onSale: true },
  { id: "prod-105", name: "Braided USB-C Cable (2m)", price: 14.99, inStock: false, onSale: false },
  { id: "prod-106", name: "Aluminum Laptop Stand", price: 39.5, inStock: true, onSale: false },
];

const INITIAL_FORM: ProductFormState = {
  name: "",
  price: "",
  inStock: true,
  onSale: false,
};

/**
 * AI-generated validation function
 * Audited:
 * 1. Sets error state directly via returned error map (zero alert() calls).
 * 2. Pure function that never mutates input form state.
 */
export function validateProductForm(form: ProductFormState): {
  isValid: boolean;
  errors: FormErrors;
} {
  const nextErrors: FormErrors = {};

  if (!form.name || form.name.trim().length === 0) {
    nextErrors.name = "Product name cannot be empty.";
  }

  const trimmedPrice = form.price.trim();
  if (!trimmedPrice) {
    nextErrors.price = "Price cannot be empty.";
  } else {
    const numericPrice = Number(trimmedPrice);
    if (Number.isNaN(numericPrice)) {
      nextErrors.price = "Price must be a valid number.";
    } else if (numericPrice <= 0) {
      nextErrors.price = "Price must be greater than 0.";
    }
  }

  return {
    isValid: Object.keys(nextErrors).length === 0,
    errors: nextErrors,
  };
}

export default function ProductManager() {
  // Products collection state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Controlled single-object form state
  const [form, setForm] = useState<ProductFormState>(INITIAL_FORM);

  // Validation errors state
  const [errors, setErrors] = useState<FormErrors>({});

  // Filter state
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Hand-written controlled input state wiring
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Hand-written submit handler with e.preventDefault()
  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateProductForm(form);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: form.name.trim(),
      price: Number(Number(form.price).toFixed(2)),
      inStock: form.inStock,
      onSale: form.onSale,
    };

    // Immutable state update
    setProducts((prev) => [...prev, newProduct]);
    setForm(INITIAL_FORM);
    setErrors({});
  };

  // Derived filtered products
  const displayedProducts = inStockOnly
    ? products.filter((product) => product.inStock)
    : products;

  // Derived count of products on sale in displayed list
  const saleCount = displayedProducts.filter((product) => product.onSale).length;

  return (
    <div className="space-y-8 p-15">
      {/* Controlled Add Product Form */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
          <p className="text-sm text-gray-500">
            Controlled form state managed with a single object and inline validation.
          </p>
        </div>

        <form onSubmit={handleAddProduct} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name Input */}
            <div>
              <label
                htmlFor="product-name"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
              >
                Product Name
              </label>
              <input
                id="product-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleInputChange}
                placeholder="e.g. Mechanical Keyboard"
                className="w-full px-3 py-2 border rounded-md text-sm transition-colors border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Product Price Input */}
            <div>
              <label
                htmlFor="product-price"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
              >
                Price ($)
              </label>
              <input
                id="product-price"
                name="price"
                type="text"
                value={form.price}
                onChange={handleInputChange}
                placeholder="e.g. 49.99"
                className="w-full px-3 py-2 border rounded-md text-sm transition-colors border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          {/* Form Options: inStock & onSale checkboxes */}
          <div className="flex flex-wrap gap-6 pt-1">
            <label
              htmlFor="product-inStock"
              className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700"
            >
              <input
                id="product-inStock"
                name="inStock"
                type="checkbox"
                value="inStock"
                checked={form.inStock}
                onChange={handleInputChange}
                className="size-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              Mark as In Stock
            </label>

            <label
              htmlFor="product-onSale"
              className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700"
            >
              <input
                id="product-onSale"
                name="onSale"
                type="checkbox"
                value="onSale"
                checked={form.onSale}
                onChange={handleInputChange}
                className="size-4 rounded text-red-600 focus:ring-red-500 border-gray-300"
              />
              Mark as On Sale
            </label>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-xs"
          >
            Add Product
          </button>
        </form>
      </section>

      {/* Product Catalog Controls & Counters */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-3">
            {/* "X products" count */}
            <span className="text-base font-semibold text-gray-900">
              {displayedProducts.length} {displayedProducts.length === 1 ? "product" : "products"}
            </span>

            {/* Red sale counter: appears with && only when count > 0 */}
            {saleCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                {saleCount} on sale
              </span>
            )}
          </div>

          {/* Interactive State-Driven "In Stock Only" Filter */}
          <div className="flex items-center gap-2">
            <input
              id="filter-inStockOnly"
              name="inStockOnly"
              type="checkbox"
              value="inStockOnly"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="size-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
            />
            <label
              htmlFor="filter-inStockOnly"
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              In stock only
            </label>
          </div>
        </div>

        {/* Product Grid from array with .map() and stable id keys */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {product.name}
                  </h3>

                  {/* Stock status badge via ternary */}
                  {product.inStock ? (
                    <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      In stock
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      Sold out
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>

                  {product.onSale && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
                      Sale
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>SKU: {product.id}</span>
                <span>{product.inStock ? "Available to ship" : "Backorder pending"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

