import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./interceptors/auth.interceptor";

export const coreProviders = [
  provideHttpClient(
    withInterceptors([authInterceptor])
  )
];
