import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';

/**
 * @description 拦截器，拦截所有http请求
 *  目前实现功能：
 *    1.请求的header中增加token
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  //如果需要注入service，使用这种方式，打开注释代码即可
  // private httpService: HttpService;
  //
  // constructor(private injector: Injector) {
  // }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log("走了", token);
    if (token) {
      const authReq = request.clone({headers: request.headers.set('token', token)});
      return next.handle(authReq);
    } else {
      return next.handle(request);
    }
  }
}

