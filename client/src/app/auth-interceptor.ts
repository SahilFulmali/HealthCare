import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.url.includes("login-user")){
    return next(req);
  }else {
    const token = localStorage.getItem('token')??"";

    const newReq= req.clone({
      setHeaders:{
        Authorization:`Bearer ${token}`
      }
    })
    return next(newReq)
    .pipe(catchError(error=>{
        if(error.status === 401){
          router.navigate([""],
          {queryParams:{msg:"Token Expired"}})
        }
        return of(error)
    }));

 
};
