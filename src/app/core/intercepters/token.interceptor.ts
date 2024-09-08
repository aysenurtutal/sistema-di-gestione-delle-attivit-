import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
// import { ToasterService } from 'src/app/shared/services/toaster.service';
// import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  private authLocalStorageToken: string = 'token';
  private spinnerCounter:number = 0;
  private selectedYear:string = '';

  httpStatusCodes: { code: number; message: string }[] = [
    { code: 301, message: 'HTTP_STATUS_CODE.301'},
    { code: 302, message: 'HTTP_STATUS_CODE.302' },
    { code: 401, message: 'HTTP_STATUS_CODE.401' },
    { code: 404, message: 'HTTP_STATUS_CODE.404' },
    { code: 405, message: 'HTTP_STATUS_CODE.405' },
    { code: 406, message: 'HTTP_STATUS_CODE.406' },
    { code: 407, message: 'HTTP_STATUS_CODE.407' },
    { code: 408, message: 'HTTP_STATUS_CODE.408' },
    { code: 409, message: 'HTTP_STATUS_CODE.409' },
    { code: 410, message: 'HTTP_STATUS_CODE.410' },
    { code: 500, message: 'HTTP_STATUS_CODE.500' },
    { code: 503, message: 'HTTP_STATUS_CODE.503' },
    { code: 504, message: 'HTTP_STATUS_CODE.504' },
  ];

  constructor(
    // private toasterService: ToasterService,
    // private translateService: TranslateService,
    private spinner: NgxSpinnerService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = localStorage.getItem(this.authLocalStorageToken);
    // const year = '2024';
    if (token) {
    }
    this.spinner.show();
    this.spinnerCounter++
    return next.handle(request).pipe(
      finalize(() => setTimeout(() => {
        this.spinnerCounter--
        if(this.spinnerCounter == 0) this.spinner.hide();
      }, 200)),
      catchError((error: HttpErrorResponse) => {
        let errName;
        if (error.status == 401) {
          // logout
          localStorage.clear();
          // window.location.reload();
        }
        if (error.error?.messages) {
          errName = error.error.messages.toString();
        } else {
          const knownHttpErrorCode = this.httpStatusCodes.find(
            (c) => c.code === error.status
          );

          if (knownHttpErrorCode) {
            errName = `${knownHttpErrorCode.code}: ${knownHttpErrorCode.message}`;
          } else {
            errName = `${error?.error?.error}`;
          }
        }
        // this.toasterService.showError(errName);
        return throwError(error);
      })
    );
  }

  addToken(
    request: HttpRequest<any>,
    next: HttpHandler,
    accessToken: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: 'Bearer ' + accessToken},
    });
  }
}
