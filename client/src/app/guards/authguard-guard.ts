import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authguardGuard: CanActivateFn = (route, state) => {
  
const auth = inject(Auth);
  const router = inject(Router);

  if (auth.authenticated()) {
    return true; // allow navigation
  }

  router.navigate(['/home']); // redirect
  return false;

};
