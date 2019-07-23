import {
  AuthService
} from './../../auth/auth.service';
import {
  FormGroup,
  FormControl
} from '@angular/forms';
import {
  Component,
  OnInit,
  createPlatformFactory
} from '@angular/core';
import {
  Router
} from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signForm: FormGroup;

  constructor(private router: Router,
    private auth: AuthService) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.signForm = new FormGroup({
      displayName: new FormControl(''),
      picture: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  async trySignUp() {
    try {
      await this.auth.emailSignUp(this.signForm.value);
      this.router.navigate(['/login']);
    } catch (error) {
      alert('coming from register');
      alert(error.message);
    }
  }
}
