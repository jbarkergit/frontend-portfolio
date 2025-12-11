import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { commerceDatabase } from '~/ecommerce/data/commerceDatabase';

export type ProductType = {
  sku: string;
  stock: number;
  company: string;
  unit: string;
  description?: string;
  price: number;
  category?: string;
  polarPattern?: string | string[];
  wearStyle?: string;
  productshowcase?: boolean;
  images?: {
    small: string[];
    medium: string[];
    large: string[];
  };
};

export type CartProductType = {
  sku: string;
  quantity: number;
  company: string;
  unit: string;
  price: number;
  images?: {
    small: string[];
    medium: string[];
    large: string[];
  };
};

type CartStateType = {
  shoppingCart: CartProductType[];
};

const getShoppingCartState = (): CartProductType[] => {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  const cache = window.localStorage.getItem('shoppingCartState');
  if (cache) return JSON.parse(cache) as CartProductType[];
  else return [];
};

//initialize cart with local Storage Shopping Cart array
const initCartState: CartStateType = { shoppingCart: getShoppingCartState() };

//define reducer action type
const CART_REDUCER_ACTION_TYPE = {
  QUANTITY: 'QUANTITY',
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  SUBMIT: 'SUBMIT',
  HYDRATE: 'HYDRATE',
} as const;

//export reducer action type
export type CartReducerActionType = typeof CART_REDUCER_ACTION_TYPE;

//export type for reducer action (CART_REDUCER_ACTION_TYPE): string, PAYLOAD(optional): CartProductType
export type CartReducerAction =
  | {
      type:
        | typeof CART_REDUCER_ACTION_TYPE.ADD
        | typeof CART_REDUCER_ACTION_TYPE.REMOVE
        | typeof CART_REDUCER_ACTION_TYPE.QUANTITY
        | typeof CART_REDUCER_ACTION_TYPE.SUBMIT;
      payload?: CartProductType;
    }
  | { type: typeof CART_REDUCER_ACTION_TYPE.HYDRATE; payload: CartProductType[] };

//implement reducer using our pre-defined types, arguments for reducer are state and action
const cartReducer = (state: CartStateType, action: CartReducerAction): CartStateType => {
  switch (action.type) {
    case CART_REDUCER_ACTION_TYPE.QUANTITY: {
      if (!action.payload) throw new Error('Action Payload may be void or undefined for Reducer Action Type QUANTITY');
      const { sku, quantity } = action.payload; //grab necessary data from CartProductType to send to our shopping cart
      const productExists: CartProductType | undefined = state.shoppingCart.find((product) => product.sku === sku); //identify which product to update, if it exists

      if (!productExists) throw new Error('Product SKU may be void or undefined: Reducer Action Type QUANTITY Failure');
      const updatedProduct: CartProductType = { ...productExists, quantity };
      const filteredCart: CartProductType[] = state.shoppingCart.filter((product) => product.sku !== sku); //identify which products in the shopping cart we are not updating
      return { ...state, shoppingCart: [...filteredCart, updatedProduct] }; //spread array of products into shopping cart, updates quantity for specified product
    }

    case CART_REDUCER_ACTION_TYPE.ADD: {
      if (!action.payload) throw new Error('Action Payload may be void or undefined for Reducer Action Type ADD');
      const { quantity, sku, company, unit, price, images } = action.payload; //grab necessary data from CartProductType to send to our shopping cart
      const productExists: CartProductType | undefined = state.shoppingCart.find((product) => product.sku === sku); //identifies products in cart to update (if in cart)
      const databaseProductStock: number | undefined = commerceDatabase.find((product) => product.sku === sku)?.stock; //checks for product stock in database

      if (productExists === undefined && databaseProductStock && databaseProductStock > 0) {
        const newItem = { quantity, sku, company, unit, price, images }; //destructure action.payload into new variable
        const updatedCart = [...state.shoppingCart, newItem]; //if product is not in cart, create new array, push new product
        return { ...state, shoppingCart: updatedCart }; //update shoppingCart with new array of products
      } else if (productExists && databaseProductStock && productExists.quantity < databaseProductStock) {
        const updatedCart = state.shoppingCart.map((product) =>
          product.sku === sku ? { ...product, quantity: product.quantity + 1 } : product
        ); //if product is in cart
        return { ...state, shoppingCart: updatedCart }; //update quantity
      } else return state;
    }

    case CART_REDUCER_ACTION_TYPE.REMOVE: {
      if (!action.payload) throw new Error('Action Payload may be void or undefined for Reducer Action Type REMOVE');
      const { sku } = action.payload; //grab necessary data from CartProductType to send to our shopping cart
      const cartProductIndex: number = state.shoppingCart.findIndex((product) => product.sku === sku);

      const product = state.shoppingCart[cartProductIndex];
      if (product && product.quantity <= 1) {
        return { ...state, shoppingCart: state.shoppingCart.filter((product) => product.sku !== sku) }; //removes product sku from cart if quantity <=1
      } else
        return {
          ...state,
          shoppingCart: state.shoppingCart.map((product) =>
            product.sku === sku ? { ...product, quantity: product.quantity - 1 } : product
          ),
        }; //decrement
    }
    case CART_REDUCER_ACTION_TYPE.SUBMIT: {
      localStorage.setItem('shoppingCartState', '');
      return { ...state, shoppingCart: [] }; //handle submission logic -> returning an empty array until I'm ready to handle a payment gateway/processor
    }

    case CART_REDUCER_ACTION_TYPE.HYDRATE:
      return { ...state, shoppingCart: action.payload };

    default:
      throw new Error('Reducer Action Type may be unidentified');
  }
};

//custom hook for useCartContext utilizing React.useReducer: envoked locally, no export required
const useCartContext = (initCartState: CartStateType) => {
  const [state, dispatch] = useReducer(cartReducer, initCartState);

  const REDUCER_ACTIONS = useMemo(() => CART_REDUCER_ACTION_TYPE, []); //prevents rerenders via caching

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = getShoppingCartState();
      if (cached.length) dispatch({ type: REDUCER_ACTIONS.HYDRATE, payload: cached });
    }
  }, [REDUCER_ACTIONS]);

  // Persist to localStorage on every change
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('shoppingCartState', JSON.stringify(state.shoppingCart));
  }, [state.shoppingCart]);

  const cartProductQuantity: number = state.shoppingCart.reduce((previousValue, cartProduct) => {
    return previousValue + cartProduct.quantity;
  }, 0);

  const cartProductSubtotal: string = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    state.shoppingCart.reduce((previousValue, cartProduct) => {
      return previousValue + cartProduct.quantity * cartProduct.price;
    }, 0)
  );

  const shoppingCart = state.shoppingCart.sort((a: CartProductType, b: CartProductType) => (a.unit > b.unit ? 1 : -1));

  return { dispatch, REDUCER_ACTIONS, cartProductQuantity, cartProductSubtotal, shoppingCart };
};

//type for UseCartContext
type UseCartContextType = ReturnType<typeof useCartContext>;

//define initial values for UseCartContext
const initCartContextState: UseCartContextType = {
  dispatch: () => {},
  REDUCER_ACTIONS: CART_REDUCER_ACTION_TYPE,
  shoppingCart: [],
  cartProductQuantity: 0,
  cartProductSubtotal: '',
};

//create CartContext
const CartContext = createContext<UseCartContextType>(initCartContextState);

//export CartContext Provider to pass required Shopping Cart data throughout application
export const CartProvider = ({ children }: { children?: ReactNode }): ReactElement => {
  return <CartContext.Provider value={useCartContext(initCartState)}>{children}</CartContext.Provider>;
};

export const useCart = (): UseCartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('A provider is required to consume CartContext.');
  return context;
};
