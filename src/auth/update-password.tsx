import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { Form } from '@/components/hook-form/form-provider';
import { RHFTextField } from '@/components/hook-form/rhf-text-field';

import { authPaths } from './paths';
import { getErrorMessage } from './error-message';
import { FormHead } from './components/form-head';
import { updatePassword } from './context/supabase/action';

const schema = zod
  .object({
    password: zod.string().min(6, 'Password must contain at least 6 characters'),
    confirmPassword: zod.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = zod.infer<typeof schema>;

export function UpdatePasswordView() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async ({ password }) => {
    try {
      await updatePassword({ password });
      window.location.assign(authPaths.signIn);
    } catch (error) {
      setError('root', { message: getErrorMessage(error) });
    }
  });

  return (
    <>
      <FormHead title="Set a new password" description="Choose a strong password for your account." />
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          {errors.root?.message && <Alert severity="error">{errors.root.message}</Alert>}
          <RHFTextField name="password" label="New password" type="password" />
          <RHFTextField name="confirmPassword" label="Confirm new password" type="password" />
          <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
            Update password
          </Button>
        </div>
      </Form>
    </>
  );
}
