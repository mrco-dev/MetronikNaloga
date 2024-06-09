import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../data.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Order } from '../orders';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  orderForm: FormGroup;
  isEditing: boolean = false;
  currentOrderId: string | null = null;

  @ViewChild('orderFormWrapper') orderFormWrapper!: ElementRef;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      omsId: ['', Validators.required],
      products: this.fb.array([]),
      orderDetails: this.fb.group({
        factoryId: ['', Validators.required],
        factoryName: [''],
        factoryAddress: [''],
        factoryCountry: ['', Validators.required],
        productionLineId: ['', Validators.required],
        productCode: ['', Validators.required],
        productDescription: ['', Validators.required],
        poNumber: [''],
        expectedStartDate: [''],
      }),
      orderId: [''],
      expectedCompletionTime: [''],
    });
  }
  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.dataService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  get products(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }

  createProductFormGroup(product?: any): FormGroup {
    return this.fb.group({
      gtin: [product?.gtin || '', Validators.required],
      quantity: [product?.quantity || '', Validators.required],
      serialNumberType: [product?.serialNumberType || '', Validators.required],
      serialNumbers: [product?.serialNumbers || '', Validators.required],
      templateId: [product?.templateId || '', Validators.required],
      productName: [product?.productName || ''],
      imageUrl: [product?.imageUrl || ''],
    });
  }
  addProductFormGroup(product?: any): void {
    this.products.push(this.createProductFormGroup(product));
  }

  removeProductFormGroup(index: number): void {
    this.products.removeAt(index);
  }

  submitOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const orderData = this.orderForm.value;
    if (this.isEditing) {
      this.dataService
        .updateOrder(this.currentOrderId!, orderData)
        .subscribe(() => {
          this.loadOrders();
          this.resetForm();
        });
    } else {
      this.dataService.addOrder(orderData).subscribe(() => {
        this.loadOrders();
        this.resetForm();
      });
    }
  }

  editOrder(order: Order): void {
    this.isEditing = true;
    this.currentOrderId = order.orderId;
    this.orderForm.patchValue(order);

    this.products.clear();
    order.products.forEach((product) => {
      this.addProductFormGroup(product);
    });

    this.orderFormWrapper.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentOrderId = null;
    this.orderForm.reset();
    this.products.clear();
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
