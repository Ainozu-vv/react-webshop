import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("CartProvider and useCart", () => {
    it("should throw error when useCart is used outside CartProvider", () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useCart());
      }).toThrow("useCart must be used within a CartProvider");
      
      consoleSpy.mockRestore();
    });

    it("should provide initial empty cart state", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.subtotal).toBe(0);
    });

    it("should add an item to the cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 100,
      };

      act(() => {
        result.current.addItem(testItem, 2);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual({ ...testItem, qty: 2 });
      expect(result.current.totalItems).toBe(2);
      expect(result.current.subtotal).toBe(200);
    });

    it("should add default quantity of 1 when qty is not specified", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 50,
      };

      act(() => {
        result.current.addItem(testItem);
      });

      expect(result.current.items[0].qty).toBe(1);
      expect(result.current.totalItems).toBe(1);
      expect(result.current.subtotal).toBe(50);
    });

    it("should increment quantity when adding existing item", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 100,
      };

      act(() => {
        result.current.addItem(testItem, 2);
      });

      act(() => {
        result.current.addItem(testItem, 3);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].qty).toBe(5);
      expect(result.current.totalItems).toBe(5);
      expect(result.current.subtotal).toBe(500);
    });

    it("should throw error when adding item without id", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const invalidItem = {
        name: "Test Product",
        price: 100,
      };

      expect(() => {
        act(() => {
          result.current.addItem(invalidItem);
        });
      }).toThrow("Item must have an id");
    });

    it("should remove an item from the cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 100,
      };

      act(() => {
        result.current.addItem(testItem, 2);
      });

      act(() => {
        result.current.removeItem(1);
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.subtotal).toBe(0);
    });

    it("should update quantity of an item", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 100,
      };

      act(() => {
        result.current.addItem(testItem, 2);
      });

      act(() => {
        result.current.setQty(1, 5);
      });

      expect(result.current.items[0].qty).toBe(5);
      expect(result.current.totalItems).toBe(5);
      expect(result.current.subtotal).toBe(500);
    });

    it("should normalize quantity to minimum 1", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 100,
      };

      act(() => {
        result.current.addItem(testItem, -5);
      });

      expect(result.current.items[0].qty).toBe(1);
    });

    it("should normalize quantity to integer", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 100,
      };

      act(() => {
        result.current.addItem(testItem, 3.7);
      });

      expect(result.current.items[0].qty).toBe(3);
    });

    it("should normalize invalid quantity to 1", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 100,
      };

      act(() => {
        result.current.addItem(testItem, "invalid");
      });

      expect(result.current.items[0].qty).toBe(1);
    });

    it("should clear the cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem1 = {
        id: 1,
        name: "Product 1",
        price: 100,
      };

      const testItem2 = {
        id: 2,
        name: "Product 2",
        price: 200,
      };

      act(() => {
        result.current.addItem(testItem1, 2);
        result.current.addItem(testItem2, 3);
      });

      expect(result.current.items).toHaveLength(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.subtotal).toBe(0);
    });

    it("should calculate totals correctly with multiple items", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem1 = {
        id: 1,
        name: "Product 1",
        price: 100,
      };

      const testItem2 = {
        id: 2,
        name: "Product 2",
        price: 50,
      };

      act(() => {
        result.current.addItem(testItem1, 2);
        result.current.addItem(testItem2, 3);
      });

      expect(result.current.totalItems).toBe(5);
      expect(result.current.subtotal).toBe(350);
    });

    it("should handle items with invalid price", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem = {
        id: 1,
        name: "Product",
        price: "invalid",
      };

      act(() => {
        result.current.addItem(testItem, 2);
      });

      expect(result.current.subtotal).toBe(0);
    });
  });

  describe("LocalStorage Integration", () => {
    it("should persist cart to localStorage", async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 100,
      };

      act(() => {
        result.current.addItem(testItem, 2);
      });

      await waitFor(() => {
        const stored = localStorage.getItem("cart:v1");
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored);
        expect(parsed.items).toHaveLength(1);
        expect(parsed.items[0]).toEqual({ ...testItem, qty: 2 });
      });
    });

    it("should load cart from localStorage on initialization", () => {
      const storedCart = {
        items: [
          { id: 1, name: "Product 1", price: 100, qty: 2 },
          { id: 2, name: "Product 2", price: 50, qty: 3 },
        ],
      };

      localStorage.setItem("cart:v1", JSON.stringify(storedCart));

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items).toEqual(storedCart.items);
      expect(result.current.totalItems).toBe(5);
      expect(result.current.subtotal).toBe(350);
    });

    it("should handle corrupted localStorage data gracefully", () => {
      localStorage.setItem("cart:v1", "invalid json");

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.subtotal).toBe(0);
    });

    it("should handle null items in localStorage", () => {
      localStorage.setItem("cart:v1", JSON.stringify({ items: null }));

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.items).toEqual([]);
    });

    it("should handle missing items property in localStorage", () => {
      localStorage.setItem("cart:v1", JSON.stringify({ other: "data" }));

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.items).toEqual([]);
    });
  });

  describe("CartProvider Component", () => {
    it("should render children components", () => {
      render(
        <CartProvider>
          <div data-testid="child">Test Child</div>
        </CartProvider>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Test Child")).toBeInTheDocument();
    });
  });
});
