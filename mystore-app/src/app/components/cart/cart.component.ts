import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Cart, CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart$: Observable<Cart>;

  constructor(private cartService: CartService) {
    this.cart$ = this.cartService.getCart$();
  }

  ngOnInit(): void {
  }

  /**
   * Update the quantity of an item in the cart
   */
  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  /**
   * Remove an item from the cart
   */
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  /**
   * Handle quantity input change
   */
  onQuantityChange(item: CartItem, event: any): void {
    const quantity = parseInt(event.target.value, 10);
    if (quantity > 0) {
      this.updateQuantity(item.product.id, quantity);
    }
  }

  /**
   * Calculate item total
   */
  getItemTotal(item: CartItem): number {
    return Math.round(item.product.price * item.quantity * 100) / 100;
  }
}
