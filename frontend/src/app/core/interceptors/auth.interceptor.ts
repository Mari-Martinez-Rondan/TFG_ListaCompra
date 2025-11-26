import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError, EMPTY } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  const router = inject(Router);

  if (token) {
    // If token is expired, remove it and navigate to login before sending request
    if (tokenService.isTokenExpired(token)) {
      tokenService.removeToken();
      router.navigate(['/login']);
      return EMPTY; // cancel the outgoing request
    }

    // Attach Authorization header when token present
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      //Si se recibe un 401, se elimina el token y se redirige al login
      if (error.status === 401) {
        tokenService.removeToken();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
