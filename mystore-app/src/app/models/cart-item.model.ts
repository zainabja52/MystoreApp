import { Product } from './product.model';

/**
 * CartItem interface representing an item in the shopping cart
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Cart interface representing the entire shopping cart
 */
export interface Cart {
  items: CartItem[];
  total: number;
}
