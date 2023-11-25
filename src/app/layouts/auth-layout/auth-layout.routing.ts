import { Routes } from '@angular/router';
import { AuthComponent } from 'src/app/modules/auth/auth.component';


export const AuthLayoutRoutes: Routes = [
    {
        path: '',
        component: AuthComponent,
        loadChildren: () =>
            import('src/app/modules/auth/auth.module').then(
                m => m.AuthModule
            )
    },
];
