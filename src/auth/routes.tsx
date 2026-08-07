import { Outlet } from 'react-router';
import type { RouteObject } from 'react-router';

import { AuthCenteredLayout } from '@/layouts/auth';

import { SignUpView } from './sign-up';
import { authPaths } from './paths';
import { CenteredSignInView } from './sign-in';
import { UpdatePasswordView } from './update-password';
import { ForgotPasswordView } from './forgot-password';

export const authRoutes: RouteObject[] = [
  {
    element: (
      <AuthCenteredLayout>
        <Outlet />
      </AuthCenteredLayout>
    ),
    children: [
      { path: authPaths.signIn, element: <CenteredSignInView /> },
      { path: authPaths.signUp, element: <SignUpView /> },
      { path: authPaths.forgotPassword, element: <ForgotPasswordView /> },
      { path: authPaths.updatePassword, element: <UpdatePasswordView /> },
    ],
  },
];
