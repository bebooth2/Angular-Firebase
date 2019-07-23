import {
  AuthService
} from './../../auth/auth.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  signedIn: boolean;
  constructor(public auth: AuthService) {}

  ngOnInit() {

    this.signedIn = false;
  }
  async onLogin() {
    await this.auth.isLoggedIn.subscribe(res => {
      this.signedIn = res;
    });
  }
  async signOut() {
    await this.auth.signOut();
    await this.auth.isLoggedIn.subscribe(res => this.signedIn = res);
  }

}
