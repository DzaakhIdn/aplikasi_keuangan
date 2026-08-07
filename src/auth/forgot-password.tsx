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
import { resetPassword } from './context/supabase/action';

const schema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Enter a valid email address'),
});

type FormValues = zod.infer<typeof schema>;

export function ForgotPasswordView() {
  const [sent, setSent] = useState(false);
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      await resetPassword({ email });
      setSent(true);
    } catch (error) {
      setError('root', { message: getErrorMessage(error) });
    }
  });

  return (
    <>
      <FormHead title="Forgot your password?" description="Enter your email to receive a recovery link." />
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          {sent && <Alert severity="success">Check your email for the recovery link.</Alert>}
          {errors.root?.message && <Alert severity="error">{errors.root.message}</Alert>}
          <RHFTextField name="email" label="Email address" />
          <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
            Send recovery link
          </Button>
          <Link href={authPaths.signIn} sx={{ textAlign: 'center' }}>
            Back to sign in
          </Link>
        </div>
      </Form>
    </>
  );
}
