import { environment } from './../environments/environment';
import {TokenStorageService} from './_services/token-storage.service';
import {Component, OnInit} from '@angular/core';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'user-manager-system-frontend';

  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  userName: string;

  constructor(private token: TokenStorageService, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.token.getToken();

    if (this.isLoggedIn) {
      const user = this.token.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.userName = user.userName;
    }
  }

  logout(): void {
    this.token.signOut();
    window.location.reload();
  }
}
