import { environment } from './../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

const AUTH_API = environment.API_URL + '/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  constructor(
    private http: HttpClient,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public token: TokenStorageService
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        localStorage.setItem('userGmail', JSON.stringify(this.user));
      } else {
        localStorage.setItem('userGmail', null);
      }
    });
  }

  signIn(credentials): Observable<any> {
    console.log('credential : ' + JSON.stringify(credentials));
    // check email from FireBase
    console.log(!credentials.phoneEmail.match('0[1-9][0-9]{8}\b'));
    // if (!credentials.phoneEmail.match('0[1-9][0-9]{8}\b')) {
    //   this.afAuth
    //     .signInWithEmailAndPassword(
    //       credentials.phoneEmail,
    //       credentials.password
    //     )
    //     .then((res) => {
    //       this.ngZone.run(() => {
    //         this.router.navigate(['account']);
    //       });
    //       localStorage.setItem('user', JSON.stringify(res.user));
    //     })
    //     .catch((error) => {
    //       window.alert(error.message);
    //     });
    // }
    const data = this.http.post(
      AUTH_API + 'sign-in',
      {
        phoneEmail: credentials.phoneEmail,
        password: credentials.password,
      },
      httpOptions
    );
    console.log('data sign in : ' + JSON.stringify(data));
    return data;
  }

  register(user): Observable<any> {
    console.log('register user : ' + JSON.stringify(user));
    // signUp Email To FireBase
    // if (!user.phoneEmail.match('0[1-9][0-9]{8}\b')) {
    //   this.afAuth
    //     .createUserWithEmailAndPassword(user.phoneEmail, user.password)
    //     .then((res) => {
    //       this.sendEmailVerification();
    //       localStorage.setItem('user', JSON.stringify(res.user));
    //     })
    //     .catch((error) => {
    //       window.alert(error.message);
    //     });
    // }
    return this.http.post(AUTH_API + 'sign-up', {
      userName: user.userName,
      phoneEmail: user.phoneEmail,
      password: user.password,
    });
  }

  forgotPasswordEmail(passwordResetEmail: string): void {
    this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          'Đã gửi thư tới mail ' +
            passwordResetEmail +
            ', hãy kiểM tra thư của bạn'
        );
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  sendEmailVerification(): void{
    this.afAuth.currentUser.then((u) => {
      u.sendEmailVerification().then(() => {
        this.router.navigate(['verify-email']);
      });
    });
  }

  public get isLoggedIn(): boolean {
    const userNow = JSON.parse(localStorage.getItem('user'));
    return userNow !== null && userNow.emailVerified !== false ? true : false;
  }

  logOut(): void{
    this.afAuth.signOut();
    localStorage.removeItem('user');
    this.token.signOut();
    this.router.navigate (['admin/login']);
  }
}