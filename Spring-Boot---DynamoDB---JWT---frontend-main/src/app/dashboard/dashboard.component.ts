import { Router } from '@angular/router';
import { ModalService } from './../_modal/modal.service';
import { Component, Input, OnInit, NgModule } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: any;
  isLoggedIn: boolean;
  datePipe: DatePipe = new DatePipe('en');

  passwordForm = this.formBuilder.group({
    currentPassword: ['', [Validators.required]],
    newPassword: [
      '',
      [
        Validators.required,
        // Validators.pattern(
        //   '^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'
        // ),
      ],
    ],
    rewritePassWord: [
      '',
      [
        Validators.required,
        // Validators.pattern(
        //   '^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'
        // ),
      ],
    ],
  });

  userForm = this.formBuilder.group({
    userNameInfo: ['', [Validators.required, Validators.minLength(3)]],
    userPhoneNumberInfo: [
      {
        value: '',
        disabled: true,
      },
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('0[1-9][0-9]{8}'),
      ],
    ],
    userBirthdayInfo: ['', [Validators.required]],
    userEmailInfo: [{ value: '', disabled: true }, [Validators.required]],
  });

  constructor(
    public modalService: ModalService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.user = this.token.getUser();
    this.userForm.setValue({
      userNameInfo: this.user.userName,
      userPhoneNumberInfo: this.user.phone,
      userBirthdayInfo: this.user.birthday,
      userEmailInfo: this.user.email,
    });
    this.userForm.controls.userNameInfo.valueChanges.subscribe((value) => {
      this.user.userName = value;
      console.log(this.user);
    });
    this.userForm.controls.userPhoneNumberInfo.valueChanges.subscribe(
      (value) => {
        this.user.phone = value;
      }
    );
    this.userForm.controls.userBirthdayInfo.valueChanges.subscribe((value) => {
      this.user.birthday = value;
    });
    this.userForm.controls.userEmailInfo.valueChanges.subscribe((value) => {
      this.user.email = value;
    });
  }
  /**
   * onSubmitPassword
   */
  public onSubmitPassword(): void {
    if (
      this.passwordForm.controls.currentPassword.value !==
        this.passwordForm.controls.newPassword.value &&
      this.passwordForm.controls.rewritePassWord.value ===
        this.passwordForm.controls.newPassword.value
    ) {
      this.user.password = this.passwordForm.controls.newPassword.value;
      this.userService.updateUser(this.user).subscribe((data) => {
        this.modalService.close('modalChangePassword');
        console.log(data);
      });
    } else if (
      this.passwordForm.controls.newPassword.value !==
      this.passwordForm.controls.rewritePassWord.value
    ) {
      alert('Mật khẩu xác nhận không trùng');
      this.passwordForm.reset();
    } else if (
      this.passwordForm.controls.currentPassword.value ===
      this.passwordForm.controls.newPassword.value
    ) {
      alert('Mật khẩu mới bị trùng');
      this.passwordForm.reset();
    }
  }

  /**
   * onUpdateInfo
   */
  public onUpdateInfo(): void {
    this.userService.updateUser(this.user).subscribe((data) => {
      console.log('data', data);
    });
  }
  /**
   * resetForm
   */
  public resetPasswordForm(): void {
    this.passwordForm.reset();
  }

  /**
   * resetUserForm
   */
  public resetUserForm(): void {
    this.userForm.setValue({
      userNameInfo: this.user.userName,
      userPhoneNumberInfo: this.user.phone,
      userBirthdayInfo: this.user.birthday,
      userEmailInfo: this.user.email,
    });
  }

  hasError(controlName, errorName): boolean {
    return this.userForm.controls[controlName].hasError(errorName);
  }
}
