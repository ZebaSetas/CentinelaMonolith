import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Login } from '../models/login';
import { UserFromToken } from '../models/user-from-token';
// @ts-ignore  
import jwt_decode from "jwt-decode";

@Injectable({
    providedIn: 'root'
})

export class LoginService {   
    userLogged:UserFromToken; 
    constructor(private http: HttpClient, private router: Router) { }
    
    
    login(login: Login): Observable<string> {
        const url = `${environment.apiEndpoint}/login`; 
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(url, JSON.stringify(login), { headers })
            .pipe(
                map((response) => response),
                tap(this.setDataIntoLocalStorage),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    setDataIntoLocalStorage(data: any): void {
        try{
            var tokenInfo = jwt_decode(data.authorization);
            this.userLogged = new UserFromToken(tokenInfo.data.user.id,
                tokenInfo.data.user.name,
                tokenInfo.data.user.email,
                tokenInfo.data.user.role,
                tokenInfo.data.organizationId);
        }
        catch(Error){
            //return null;
        }
        //localStorage.setItem('email', tokenInfo.data.user.email);
        //localStorage.setItem('authorization', data.authorization)        
        sessionStorage.setItem('user', JSON.stringify(this.userLogged));
        sessionStorage.setItem('authorization', data.authorization);
        sessionStorage.setItem('tokenExpiration', tokenInfo.exp);
    }

    getToken(): string {
        //return localStorage.getItem('authorization');
        return sessionStorage.getItem('authorization');
    }

    getTokenExpiration(): string {
        //return localStorage.getItem('authorization');
        return sessionStorage.getItem('tokenExpiration');
    }

    getLoggedUser(): UserFromToken {
        return JSON.parse(sessionStorage.getItem('user'));
      }

    userIsAdmin(): boolean {
        var userLogged = this.getLoggedUser();
        return userLogged.role.toString()==='1';
    }
        
    logout(): void {
        sessionStorage.removeItem('authorization');
        sessionStorage.removeItem('tokenExpiration');
        sessionStorage.removeItem('user');
        this.router.navigate(['/login']);
    }
}