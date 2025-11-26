import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * Functional route guard that redirects unauthenticated users to /login.
 */
export const authGuard: CanActivateFn = () => {
	const tokenService = inject(TokenService);
	const router = inject(Router);

	// Use isLoggedIn() so we reject expired tokens as well
	if (tokenService.isLoggedIn()) {
		return true;
	}

	// Not authenticated — navigate to login and cancel activation
	router.navigate(['/login']);
	return false;
};
