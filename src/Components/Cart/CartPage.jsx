import React from "react";
import { useCart } from "../Contexts/CartContext";

const CartPage = () => {
  const { items, totalItems, subtotal, setQty, removeItem, clearCart } = useCart();

  if (!items.length) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold text-slate-900">Cart</h1>
        <p className="text-slate-600 mt-2">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Cart</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-slate-900 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 px-4 py-2 text-sm"
        >
          Clear
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((x) => (
          <div
            key={x.id}
            className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4"
          >
            <div className="min-w-0">
              <div className="font-medium text-slate-900 truncate">{x.name}</div>
              <div className="text-sm text-slate-600">${Number(x.price || 0).toFixed(2)}</div>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="w-20 border border-slate-200 rounded-md px-2 py-1"
                type="number"
                min={1}
                value={x.qty}
                onChange={(e) => setQty(x.id, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeItem(x.id)}
                className="text-slate-900 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 px-3 py-2 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-slate-700">Items: {totalItems}</div>
        <div className="text-lg font-semibold text-slate-900">
          Subtotal: ${Number(subtotal || 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
