import { FormGroup } from '@angular/forms';
import { AuthService } from './../_services/auth.service';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {VerifyPhoneComponent} from '../verify-phone/verify-phone.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  isRegister = true;

  requestRegisterForm: FormGroup;
  @ViewChild(VerifyPhoneComponent) verifyPhone;
  isVerifyPhoneSuccess: boolean;
  isVerifyEmailSuccess: boolean;

  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  verifyPhoneForm: FormGroup;

  constructor(private auServive: AuthService, private router: Router) {}
  ngAfterViewInit(): void {
    console.log('- After : isVerifyEmailSuccess : ' + this.isVerifyEmailSuccess + ', isVerifyEmailSuccess : ' + this.isVerifyPhoneSuccess);
  }
  ngOnInit(): void {
    console.log('is verify : ' + this.isVerifyPhoneSuccess);
    console.log('is verify : ' + this.isVerifyEmailSuccess);
    console.log('- onInit : isVerifyEmailSuccess : ' + this.isVerifyEmailSuccess + ', isVerifyEmailSuccess : ' + this.isVerifyPhoneSuccess);
  }

  onSubmit(): void {

    this.form = {
      phoneEmail: sessionStorage.getItem("phone"),
      userName: this.form.userName,
      password: this.form.password,
    }

    console.log('Form : ' + JSON.stringify(this.form));

    this.auServive.register(this.form).subscribe(
      (data) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
    this.router.navigate(['login']);
  }

  hasError(controlName, errorName): boolean {
    return this.verifyPhoneForm.controls[controlName].hasError(errorName);
  }

  isVerify(value){
    this.isVerifyEmailSuccess = true;
    this.isVerifyPhoneSuccess = true;
  }
}
