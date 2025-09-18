import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Order } from '../../models/user.model';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  order: Order | null = null;
  orderNumber: string = '';

  constructor(private router: Router) {
    // Get order data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order = navigation.extras.state['order'];
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
