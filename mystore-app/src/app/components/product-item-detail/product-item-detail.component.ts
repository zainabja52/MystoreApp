import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-item-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.css']
})
export class ProductItemDetailComponent implements OnInit {
  product$: Observable<Product | undefined>;
  selectedQuantity: number = 1;
  showAddedMessage: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.productService.getProduct(id);
      })
    );
  }

  ngOnInit(): void {
  }

  /**
   * Add the product to cart with selected quantity
   */
  addToCart(product: Product): void {
    if (product && this.selectedQuantity > 0) {
      this.cartService.addToCart(product, this.selectedQuantity);
      this.showAddedMessage = true;
      
      // Hide the message after 3 seconds
      setTimeout(() => {
        this.showAddedMessage = false;
      }, 3000);
      
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

  /**
   * Navigate back to product list
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
