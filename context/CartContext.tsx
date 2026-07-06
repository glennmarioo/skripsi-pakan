'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Product {
  name: string;
  price: string;
  stock: number;
  age_category: string;
  protein: string;
  description: string;
  image_url?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  isCartOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { name: string; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product) => void;
  clearCart: () => void;
} | null>(null);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = parseFloat(item.product.price.replace('Rp ', '').replace('.', ''));
    return total + (price * item.quantity);
  }, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.product.name === action.payload.name);
      let newItems;

      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.name === action.payload.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { product: action.payload, quantity: 1 }];
      }

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.product.name !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems),
      };

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.product.name === action.payload.name
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isCartOpen: false,
      };

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        isCartOpen: state.isCartOpen,
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, isCartOpen: false });

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, dispatch, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};