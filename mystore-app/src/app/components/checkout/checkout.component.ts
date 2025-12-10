import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cart } from '../../models/cart-item.model';
import { User, Order } from '../../models/user.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart$: Observable<Cart>;
  
  user: User = {
    fullName: '',
    address: '',
    creditCardNumber: ''
  };

  // Form validation flags
  isSubmitting = false;
  formErrors: { [key: string]: string } = {};

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cart$ = this.cartService.getCart$();
  }

  ngOnInit(): void {
  }

  /**
   * Validate the form
   */
  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    // Validate full name
    if (!this.user.fullName.trim()) {
      this.formErrors['fullName'] = 'Full name is required';
      isValid = false;
    } else if (this.user.fullName.trim().length < 3) {
      this.formErrors['fullName'] = 'Full name must be at least 3 characters';
      isValid = false;
    }

    // Validate address
    if (!this.user.address.trim()) {
      this.formErrors['address'] = 'Address is required';
      isValid = false;
    } else if (this.user.address.trim().length < 6) {
      this.formErrors['address'] = 'Address must be at least 6 characters';
      isValid = false;
    }

    // Validate credit card number (basic validation)
    if (!this.user.creditCardNumber.trim()) {
      this.formErrors['creditCardNumber'] = 'Credit card number is required';
      isValid = false;
    } else if (!/^\d{16}$/.test(this.user.creditCardNumber.replace(/\s/g, ''))) {
      this.formErrors['creditCardNumber'] = 'Credit card number must be 16 digits';
      isValid = false;
    }

    return isValid;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.validateForm()) {
      this.isSubmitting = true;
      this.cartService.getCart$().subscribe(cart => {
        if (cart.items.length === 0) {
          alert('Your cart is empty!');
          this.router.navigate(['/']);
          return;
        }

        // Create order object
        const order: Order = {
          user: { ...this.user },
          items: [...cart.items],
          total: cart.total,
          orderDate: new Date()
        };

        // Simulate order processing delay
        setTimeout(() => {
          // Navigate to confirmation page with order data
          // Don't clear cart here - let confirmation page handle it
          this.router.navigate(['/confirmation'], {
            state: { order }
          });
        }, 1500);
      });
    }
  }

  /**
   * Format credit card number with spaces
   */
  formatCreditCard(): void {
    let value = this.user.creditCardNumber.replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substring(0, 19);
    }
    this.user.creditCardNumber = formattedValue;
  }

  /**
   * Check if field has error
   */
  hasError(field: string): boolean {
    return !!this.formErrors[field];
  }

  /**
   * Get error message for field
   */
  getError(field: string): string {
    return this.formErrors[field] || '';
  }
}
