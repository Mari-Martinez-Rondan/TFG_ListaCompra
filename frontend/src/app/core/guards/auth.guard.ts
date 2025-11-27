import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

//Guardia de ruta funcional que redirige a los usuarios no autenticados a /login.
export const authGuard: CanActivateFn = () => {
	const tokenService = inject(TokenService);
	const router = inject(Router);

	// Usuario autenticado
	if (tokenService.isLoggedIn()) {
		return true;
	}

	// No autenticado — redirigir a login y cancelar la activación
	router.navigate(['/login']);
	return false;
};
