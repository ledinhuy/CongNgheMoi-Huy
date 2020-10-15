import { environment } from './../../environments/environment.prod';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { User } from '../_request/account/user';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + sessionStorage.getItem('auth-token'),
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  API_URL = environment.API_URL + '/api/user';
  constructor(private http: HttpClient, private token: TokenStorageService) {}

  getPublicContent(): Observable<any> {
    return this.http.get(this.API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(this.API_URL + 'user', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(this.API_URL + 'admin', { responseType: 'text' });
  }

  updateUser(user: any): Observable<any> {
    const url = `${this.API_URL + '/update'}/${user.userId}`;

    console.log('header : ' + JSON.stringify(httpOptions));
    const data = JSON.stringify(user);
    console.log('update data : ' + data);
    return this.http
      .put(`${this.API_URL + '/update'}/${user.userId}`, user);
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.log(error.error);
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
