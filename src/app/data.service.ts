import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Order } from './orders';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api';

  private isLoggedIn = false;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && localStorage.getItem('isLoggedIn')) {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .get<{ username: string; password: string }[]>(`${this.apiUrl}/users`)
      .pipe(
        map((users) =>
          users.some(
            (user) => user.username === username && user.password === password
          )
        ),
        tap((isAuthenticated) => {
          this.isLoggedIn = isAuthenticated;
          localStorage.setItem('isLoggedIn', isAuthenticated.toString());
        })
      );
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order);
  }

  updateOrder(orderId: string, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/orders/${orderId}`, order);
  }
}
