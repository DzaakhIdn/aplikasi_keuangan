import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from '@/components/iconify';
import { Form } from '@/components/hook-form/form-provider';
import { RHFTextField } from '@/components/hook-form/rhf-text-field';
import { CONFIG } from '@/global-config';

import { getErrorMessage } from './error-message';
import { FormHead } from './components/form-head';
import { signInWithPassword } from './context/supabase/action';
import { AnimateLogoRotate } from '@/components/animate';

// ----------------------------------------------------------------------

const signInSchema = zod.object({
    email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
    password: zod
        .string()
        .min(1, { message: 'Password is required!' })
        .min(6, { message: 'Password must be at least 6 characters!' }),
});

type SignInFormValues = zod.infer<typeof signInSchema>;

// ----------------------------------------------------------------------

export function CenteredSignInView() {
    const showPassword = useBoolean();

    const defaultValues = {
        email: '',
        password: '',
    };

    const methods = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await signInWithPassword({ email: data.email, password: data.password });
            window.location.assign(CONFIG.auth.redirectPath);
        } catch (error) {
            setError('root', { message: getErrorMessage(error) });
        }
    });

    const renderForm = () => (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            {errors.root?.message && <Alert severity="error">{errors.root.message}</Alert>}

            <RHFTextField
                name="email"
                label="Email address"
                slotProps={{ inputLabel: { shrink: true } }}
            />

            <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>

                <RHFTextField
                    name="password"
                    label="Password"
                    placeholder="6+ characters"
                    type={showPassword.value ? 'text' : 'password'}
                    slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={showPassword.onToggle} edge="end">
                                        <Iconify
                                            icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                                        />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            <Button
                fullWidth
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                loadingIndicator="Sign in..."
            >
                Sign in
            </Button>
        </Box>
    );

    return (
        <>
            <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />
            <FormHead
                sx={{ mb: 3 }}
                title="Sign in to your account"
                description={
                    <>
                    </>
                }
            />

            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm()}
            </Form>

        </>
    );
}
