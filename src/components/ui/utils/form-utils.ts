import * as React from 'react';
import { FieldPath, FieldValues, useFormContext, ControllerProps } from 'react-hook-form';

export interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> { name: TName }

export const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

export function useFormFieldContext() { return React.useContext(FormFieldContext); }

export interface FormItemContextValue { id: string }
export const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

export function useFormItemContext() { return React.useContext(FormItemContext); }

export function useFieldState() {
  const fieldContext = useFormFieldContext();
  const itemContext = useFormItemContext();
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) throw new Error('useFieldState must be used within <FormField>');
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

export type GenericControllerProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = ControllerProps<TFieldValues, TName>;
