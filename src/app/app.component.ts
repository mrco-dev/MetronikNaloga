import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, LoginComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'NalogaMetronik';

  dataService = inject(DataService);
  router = inject(Router);

  logout() {
    this.dataService.logout();
    this.router.navigate(['/login']);
  }

  get isAuthenticated(): boolean {
    return this.dataService.isAuthenticated();
  }
}
