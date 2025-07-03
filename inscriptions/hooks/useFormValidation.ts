import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export interface ValidationError {
  field: string;
  message: string;
}

export const useFormValidation = <T extends Record<string, any>>(
  schema: yup.ObjectSchema<T>,
  defaultValues?: Partial<T>
) => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    getValues,
    reset,
    watch,
    trigger,
  } = useForm<T>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues as T,
    mode: 'onChange',
  });

  const validateField = useCallback(async (fieldName: keyof T) => {
    try {
      await trigger(fieldName as string);
      return true;
    } catch (error) {
      return false;
    }
  }, [trigger]);

  const validateForm = useCallback(async () => {
    try {
      const isValid = await trigger();
      return isValid;
    } catch (error) {
      return false;
    }
  }, [trigger]);

  const getFieldError = useCallback((fieldName: keyof T): string | undefined => {
    return errors[fieldName]?.message;
  }, [errors]);

  const hasFieldError = useCallback((fieldName: keyof T): boolean => {
    return !!errors[fieldName];
  }, [errors]);

  const clearFieldError = useCallback((fieldName: keyof T) => {
    if (errors[fieldName]) {
      trigger(fieldName as string);
    }
  }, [errors, trigger]);

  const clearAllErrors = useCallback(() => {
    reset(getValues());
  }, [reset, getValues]);

  const setFieldValue = useCallback((fieldName: keyof T, value: any) => {
    setValue(fieldName, value);
    // Trigger validation for the field
    setTimeout(() => trigger(fieldName as string), 100);
  }, [setValue, trigger]);

  return {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    getValues,
    reset,
    watch,
    trigger,
    validationErrors,
    setValidationErrors,
    validateField,
    validateForm,
    getFieldError,
    hasFieldError,
    clearFieldError,
    clearAllErrors,
    setFieldValue,
  };
};

// Helper component for controlled inputs with validation
export const ValidatedInput = ({ 
  control, 
  name, 
  rules, 
  error, 
  ...props 
}: any) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
        <div>
          <input
            {...props}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={fieldError ? 'error' : ''}
          />
          {(fieldError || error) && (
            <span className="error-message">
              {fieldError?.message || error}
            </span>
          )}
        </div>
      )}
    />
  );
};

// Helper function to format validation errors
export const formatValidationErrors = (errors: any): ValidationError[] => {
  const formattedErrors: ValidationError[] = [];
  
  Object.keys(errors).forEach((field) => {
    if (errors[field]?.message) {
      formattedErrors.push({
        field,
        message: errors[field].message,
      });
    }
  });
  
  return formattedErrors;
}; 