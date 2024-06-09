import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OrderListComponent } from './order-list/order-list.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login page' },
  {
    path: 'order-list',
    component: OrderListComponent,
    title: 'Order list page',
    canActivate: [AuthGuard],
  },
];
