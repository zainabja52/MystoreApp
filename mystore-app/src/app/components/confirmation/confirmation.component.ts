import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Order } from '../../models/user.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  orderNumber: string = '';

  constructor(
    private router: Router,
    private cartService: CartService
  ) {
    // Get order data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order = navigation.extras.state['order'];
      // Store order in sessionStorage as backup
      if (this.order) {
        sessionStorage.setItem('lastOrder', JSON.stringify(this.order));
      }
    } else {
      // Try to retrieve from sessionStorage if navigation state is lost
      const storedOrder = sessionStorage.getItem('lastOrder');
      if (storedOrder) {
        this.order = JSON.parse(storedOrder);
      }
    }
  }

  ngOnInit(): void {
    // If no order data, redirect to home
    if (!this.order) {
      this.router.navigate(['/']);
      return;
    }

    // Generate a random order number
    this.orderNumber = this.generateOrderNumber();
  }

  ngOnDestroy(): void {
    // Clear the cart when leaving the confirmation page
    this.cartService.clearCart();
    // Clear the stored order from sessionStorage
    sessionStorage.removeItem('lastOrder');
  }

  /**
   * Generate a random order number
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Calculate item total
   */
  getItemTotal(price: number, quantity: number): number {
    return Math.round(price * quantity * 100) / 100;
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  /**
   * Navigate back to products
   */
  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
