import * as React from "react";
import { useState } from "react";

// Base entity interface
export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  onSale: boolean;
  internalCostCode: string; // Internal field
}

// Derived Types via Utility Types
export type PublicProduct = Omit<Product, "internalCostCode">;
export type ProductFormDraft = Partial<Omit<Product, "id">>;

export interface FormErrors {
  name?: string;
  price?: string;
}

// Component Props Interfaces
interface ProductCardProps {
  product?: PublicProduct;
  onSelect?: (id: string) => void;
}

interface ProductFormProps {
  initialValues?: ProductFormDraft;
  onSubmit: (draft: ProductFormDraft) => void;
}

const INITIAL_PRODUCTS: PublicProduct[] = [
  { id: "prod-101", name: "Wireless Mechanical Keyboard", price: 89.99, inStock: true, onSale: true },
  { id: "prod-102", name: "Ergonomic Vertical Mouse", price: 45.0, inStock: true, onSale: false },
  { id: "prod-103", name: "Ultra-Wide Gaming Monitor", price: 349.99, inStock: false, onSale: true },
  { id: "prod-104", name: "Active Noise-Cancelling Headphones", price: 179.99, inStock: true, onSale: true },
  { id: "prod-105", name: "Braided USB-C Cable (2m)", price: 14.99, inStock: false, onSale: false },
  { id: "prod-106", name: "Aluminum Laptop Stand", price: 39.5, inStock: true, onSale: false },
];

export function validateProductForm(draft: ProductFormDraft): {
  isValid: boolean;
  errors: FormErrors;
} {
  const nextErrors: FormErrors = {};

  if (!draft.name || draft.name.trim().length === 0) {
    nextErrors.name = "Product name cannot be empty.";
  }

  const rawPrice = draft.price !== undefined ? String(draft.price).trim() : "";
  if (!rawPrice) {
    nextErrors.price = "Price cannot be empty.";
  } else {
    const numericPrice = Number(rawPrice);
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

// Sub-component 1: ProductCard
export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const displayName = product?.name ?? "Unnamed Product";
  const displayPrice = product?.price ?? 0;
  const isInStock = product?.inStock ?? false;
  const isOnSale = product?.onSale ?? false;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {displayName}
          </h3>

          {isInStock ? (
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
            ${displayPrice.toFixed(2)}
          </span>

          {isOnSale && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
              Sale
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>SKU: {product?.id ?? "N/A"}</span>
        {product?.id && onSelect && (
          <button
            type="button"
            onClick={() => onSelect(product.id)}
            className="text-blue-600 hover:underline font-medium"
          >
            Select
          </button>
        )}
      </div>
    </div>
  );
};

// Sub-component 2: ProductForm
export const ProductForm: React.FC<ProductFormProps> = ({ initialValues, onSubmit }) => {
  const [draft, setDraft] = useState<ProductFormDraft>(
    initialValues ?? { name: "", price: undefined, inStock: true, onSale: false }
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateProductForm(draft);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(draft);
    setDraft({ name: "", price: undefined, inStock: true, onSale: false });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="product-name" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Product Name
          </label>
          <input
            id="product-name"
            name="name"
            type="text"
            value={draft.name ?? ""}
            onChange={handleInputChange}
            placeholder="e.g. Mechanical Keyboard"
            className="w-full px-3 py-2 border rounded-md text-sm transition-colors border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="product-price" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            id="product-price"
            name="price"
            type="text"
            value={draft.price ?? ""}
            onChange={handleInputChange}
            placeholder="e.g. 49.99"
            className="w-full px-3 py-2 border rounded-md text-sm transition-colors border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.price && <p className="mt-1 text-xs text-red-600 font-medium">{errors.price}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-1">
        <label htmlFor="product-inStock" className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
          <input
            id="product-inStock"
            name="inStock"
            type="checkbox"
            checked={draft.inStock ?? false}
            onChange={handleInputChange}
            className="size-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          Mark as In Stock
        </label>

        <label htmlFor="product-onSale" className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
          <input
            id="product-onSale"
            name="onSale"
            type="checkbox"
            checked={draft.onSale ?? false}
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
  );
};

// Root Parent Component
export default function ProductManager() {
  const [products, setProducts] = useState<PublicProduct[] | null>(INITIAL_PRODUCTS);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const handleAddProduct = (draft: ProductFormDraft): void => {
    const newProduct: PublicProduct = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: (draft.name ?? "").trim(),
      price: Number(Number(draft.price ?? 0).toFixed(2)),
      inStock: draft.inStock ?? false,
      onSale: draft.onSale ?? false,
    };

    setProducts((prev) => (prev ? [...prev, newProduct] : [newProduct]));
  };

  const displayedProducts = (products ?? []).filter((product) =>
    inStockOnly ? product.inStock : true
  );

  const saleCount = displayedProducts.filter((product) => product.onSale).length;
  
 

  return (
    <div className="space-y-8 p-15">
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
          <p className="text-sm text-gray-500">
            Controlled form state managed with derived types and inline validation.
          </p>
        </div>
        <ProductForm onSubmit={handleAddProduct} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-gray-900">
              {displayedProducts.length} {displayedProducts.length === 1 ? "product" : "products"}
            </span>

            {saleCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                {saleCount} on sale
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="filter-inStockOnly"
              name="inStockOnly"
              type="checkbox"
              checked={inStockOnly}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInStockOnly(e.target.checked)}
              className="size-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
            />
            <label htmlFor="filter-inStockOnly" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
              In stock only
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          )) ?? <p className="text-gray-500">No products available.</p>}
        </div>
      </section>
    </div>
  );
}