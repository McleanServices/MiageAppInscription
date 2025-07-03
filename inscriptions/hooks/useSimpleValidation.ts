import { useCallback, useState } from 'react';
import { validateField, validateForm } from '../utils/formValidation';

export interface ValidationError {
  field: string;
  message: string;
}

export const useSimpleValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFieldValue = useCallback(async (
    schema: any,
    data: any,
    field: string
  ) => {
    const result = await validateField(schema, data, field);
    if (!result.isValid) {
      setErrors(prev => ({ ...prev, [field]: result.error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    return result.isValid;
  }, []);

  const validateFormData = useCallback(async (schema: any, data: any) => {
    const result = await validateForm(schema, data);
    setErrors(result.errors);
    return result.isValid;
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback((field: string): string | undefined => {
    return errors[field];
  }, [errors]);

  const hasFieldError = useCallback((field: string): boolean => {
    return !!errors[field];
  }, [errors]);

  return {
    errors,
    validateFieldValue,
    validateFormData,
    clearFieldError,
    clearAllErrors,
    getFieldError,
    hasFieldError,
  };
}; 