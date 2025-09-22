import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product!: Product;
  selectedQuantity: number = 1;
  showAddedMessage: boolean = false;
    @Output() addedToCart = new EventEmitter<{product: Product, quantity: number}>();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
  }

  /**
   * Add the product to cart with selected quantity
   */
  addToCart(): void {
    if (this.product && this.selectedQuantity > 0) {
        this.cartService.addToCart(this.product, this.selectedQuantity);
        this.addedToCart.emit({ product: this.product, quantity: this.selectedQuantity });
      this.showAddedMessage = true;
      
      // Hide the message after 2 seconds
      setTimeout(() => {
        this.showAddedMessage = false;
      }, 2000);
      
      // Reset quantity to 1
      this.selectedQuantity = 1;
    }
  }

  /**
   * Handle quantity change
   */
  onQuantityChange(): void {
    if (this.selectedQuantity < 1) {
      this.selectedQuantity = 1;
    }
  }
}
