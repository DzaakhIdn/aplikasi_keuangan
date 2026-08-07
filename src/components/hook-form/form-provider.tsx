import type { FormEventHandler, ReactNode } from 'react';
import { FormProvider as RHFForm } from 'react-hook-form';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

// ----------------------------------------------------------------------

type FormProps<T extends FieldValues> = {
  children: ReactNode;
  methods: UseFormReturn<T>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function Form<T extends FieldValues>({ children, onSubmit, methods }: FormProps<T>) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {children}
      </form>
    </RHFForm>
  );
}
