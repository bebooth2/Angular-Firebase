import {
  auth
} from 'firebase/app';
import {
  AuthService
} from './../../auth/auth.service';

import {
  Component,
  Input,
  Output
} from '@angular/core';

import {
  Router,
  Params
} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  errorMessage = '';


  constructor(
    public authService: AuthService,
    private router: Router) {
    this.createForm();
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }
  async tryFacebookLogin() {
    try {
      await this.authService.facebookSignin();
      this.router.navigate(['/about']);

    } catch (error) {
      alert(error.message);
      this.router.navigate(['/login']);
    }
  }

  async tryGoogleLogin() {
    try {
      await this.authService.googleSignin();

      this.router.navigate(['/about']);
    } catch (error) {
      alert(error.message);
      this.router.navigate(['/login']);
    }
  }


  async tryLogin() {
    try {
      await this.authService.emailSignin(this.loginForm.value);
      this.router.navigate(['/about']);

    } catch (error) {

      this.router.navigate(['/login']);
    }
  }
}
