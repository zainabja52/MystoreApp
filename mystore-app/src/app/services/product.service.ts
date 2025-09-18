import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dataUrl = 'assets/data.json';

  constructor(private http: HttpClient) { }

  /**
   * Fetch all products from the data.json file
   * @returns Observable<Product[]>
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.dataUrl);
  }

  /**
   * Get a single product by ID
   * @param id Product ID
   * @returns Observable<Product | undefined>
   */
  getProduct(id: number): Observable<Product | undefined> {
    return new Observable(observer => {
      this.getProducts().subscribe(products => {
        const product = products.find(p => p.id === id);
        observer.next(product);
        observer.complete();
      });
    });
  }
}
