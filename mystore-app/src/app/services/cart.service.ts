import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Cart } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<Cart>(this.getCart());

  constructor() { }

  /**
   * Get the current cart as an Observable
   * @returns Observable<Cart>
   */
  getCart$(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  /**
   * Get the current cart state
   * @returns Cart
   */
  getCart(): Cart {
    const total = this.cartItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
    return {
      items: [...this.cartItems],
      total: Math.round(total * 100) / 100 // Round to 2 decimal places
    };
  }

  /**
   * Add a product to the cart
   * @param product Product to add
   * @param quantity Quantity to add
   */
  addToCart(product: Product, quantity: number): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    
    this.updateCart();
  }

  /**
   * Update the quantity of an item in the cart
   * @param productId Product ID
   * @param quantity New quantity
   */
  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  /**
   * Remove a product from the cart
   * @param productId Product ID to remove
   */
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
  }

  /**
   * Clear all items from the cart
   */
  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  /**
   * Get the total number of items in the cart
   * @returns number
   */
  getItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Update the cart and notify subscribers
   */
  private updateCart(): void {
    this.cartSubject.next(this.getCart());
  }
}
