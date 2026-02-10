import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

const CartContext = createContext(null); //bárhonnan elérhető a komponens fában

const STORAGE_KEY = "cart:v1";

//hibás/üres tárolt érték esetén, a fallback értékét adjuk vissza.
function safeParseJson(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

//kezdő érték meghatározása (betöltés localstorageből, ha létezik)
//a useReducerben ez csak egyszer fut le, amikor mountol
function getInitialState() {
  if (typeof window === "undefined") return { items: [] };
  const stored = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeParseJson(stored, { items: [] });
  if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
  return { items: parsed.items };
}

//mennyiség normalizálás (számként kezelje le, csak egész érték!)

function normalizeQty(qty) {
  const asNumber = Number(qty);
  if (!Number.isFinite(asNumber)) return 1;
  return Math.max(1, Math.floor(asNumber));
}

//reducer
//bemenet: az aktuális állapot, egy action
//kimenet: új állapot
//action forma: { type: string, payload: any }

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, qty } = action.payload;
      const quantity = normalizeQty(qty);
      const existingIndex = state.items.findIndex((x) => x.id === item.id);
      if (existingIndex === -1) {
        return {
          ...state,
          items: [...state.items, { ...item, qty: quantity }],
        };
      }
      const next = state.items.map((x, idx) =>
        idx === existingIndex
          ? { ...x, qty: normalizeQty(x.qty + quantity) }
          : x,
      );
      return {
        ...state,
        items: next,
      };
    }

    case "REMOVE_ITEM": {
      const { id } = action.payload;
      return { ...state, items: state.items.filter((x) => x.id !== id) };
    }

    case "SET_QTY": {
      const { id, qty } = action.payload;
      const quantity = normalizeQty(qty);
      return {
        ...state,
        items: state.items.map((x) =>
          x.id === id ? { ...x, qty: quantity } : x,
        ),
      };
    }
    case "CLEAR": {
      return { ...state, items: [] };
    }
    default: {
      return state;
    }
  }
}

export function CartProvider({ children }) {
  //useReducer:
  //state: kosár aktuális tartalma
  //dispatch: ezzel küldünk actiont a reducernek
  //cartReducer eldönti az action alapján mi változik
  const [state, dispatch] = useReducer(cartReducer, undefined, getInitialState);

  //bármilyen változás esetén mentsük le a localstorageba
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: state.items }),
    );
  }, [state.items]);

  //useMemo: ne számoljuk újra feleslegesen, csak ha változik a state.items!

  const totals = useMemo(() => {
    const totalItems = state.items.reduce(
      (sum, x) => sum + normalizeQty(x.qty),
      0,
    );
    const subtotal = state.items.reduce(
      (sum, x) => sum + (Number(x.price) || 0) * normalizeQty(x.qty),
      0,
    );
    return {
      totalItems,
      subtotal,
    };
  }, [state.items]);

  const value = useMemo(() => {
    return {
      items: state.items,

      totalItems: totals.totalItems,
      subtotal: totals.subtotal,

      addItem: (item, qty = 1) => {
        if (!item || item.id == null) {
          throw new Error("Item must have an id");
        }
        dispatch({ type: "ADD_ITEM", payload: { item, qty } });
      },
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
      setQty: (id, qty) => dispatch({ type: "SET_QTY", payload: { id, qty } }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items, totals.subtotal, totals.totalItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(){
    const ctx=useContext(CartContext);
    if(!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
}
