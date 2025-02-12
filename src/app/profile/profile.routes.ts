import { Routes } from '@angular/router';
import { profileResolver } from './resolvers/profile.resolver';

export const profileRoutes: Routes = [
  {
    path: 'me',
    loadComponent: () =>
      import('./profile/profile.page').then(
        (m) => m.ProfilePage
      ),
    resolve: {
      user: profileResolver
    }
  },
  {
    path: ':id',
    loadComponent: () =>
        import('./profile/profile.page').then(
            (m) => m.ProfilePage
        ),
    title: 'Profile Page | Angular Events',
    resolve: {
        user: profileResolver,
    },
},
{
  path: '',
  redirectTo: 'me',
  pathMatch: 'full'
},
{
  path: '**',
  redirectTo: '/events'
}
];