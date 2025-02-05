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
  }
];