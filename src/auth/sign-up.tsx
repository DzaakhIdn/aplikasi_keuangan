import { useState } from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

import { Form } from '@/components/hook-form/form-provider';
import { RHFTextField } from '@/components/hook-form/rhf-text-field';

import { authPaths } from './paths';
import { getErrorMessage } from './error-message';
import { FormHead } from './components/form-head';
import { signUp } from './context/supabase/action';

const schema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: zod.string().min(6, 'Password must contain at least 6 characters'),
});

type FormValues = zod.infer<typeof schema>;

export function SignUpView() {
  const [submitted, setSubmitted] = useState(false);
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const data = await signUp(values);
      if (data.session) window.location.assign('/');
      else setSubmitted(true);
    } catch (error) {
      setError('root', { message: getErrorMessage(error) });
    }
  });

  return (
    <>
      <FormHead title="Create an account" description="Register with your email and password." />
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          {submitted && <Alert severity="success">Check your email to confirm your account.</Alert>}
          {errors.root?.message && <Alert severity="error">{errors.root.message}</Alert>}
          <RHFTextField name="email" label="Email address" />
          <RHFTextField name="password" label="Password" type="password" />
          <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
            Create account
          </Button>
          <Link href={authPaths.signIn} sx={{ textAlign: 'center' }}>
            Already have an account?
          </Link>
        </div>
      </Form>
    </>
  );
}
