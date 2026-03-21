import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [CommonModule]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error: string | null = null;
  selectedProduct: Product | null = null;
  selectedSectorId: number | null = null;
  uniqueSectors: { id: number; title: string }[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.extractUniqueSectors();
        this.loading = false;
        console.log('Products loaded:', this.products);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load solutions. Please check your connection and try again.';
        this.loading = false;
        
        
      }
    });
  }

  private extractUniqueSectors(): void {
    const sectorMap = new Map<number, string>();
    this.products.forEach(product => {
      if (product.sector && !sectorMap.has(product.sector.id)) {
        sectorMap.set(product.sector.id, product.sector.title);
      }
    });
    
    this.uniqueSectors = Array.from(sectorMap.entries()).map(([id, title]) => ({
      id,
      title
    }));
  }

  filterBySector(sectorId: number | null): void {
    this.selectedSectorId = sectorId;
    
    if (sectorId === null) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        product => product.sector?.id === sectorId
      );
    }
  }

  openProductModal(product: Product): void {
    this.selectedProduct = product;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedProduct = null;
    document.body.style.overflow = 'auto';
  }

  
}