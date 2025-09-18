/**
 * User interface representing customer information for checkout
 */
export interface User {
  fullName: string;
  address: string;
  creditCardNumber: string;
}

/**
 * Order interface representing a completed order
 */
export interface Order {
  user: User;
  items: import('./cart-item.model').CartItem[];
  total: number;
  orderDate: Date;
}
