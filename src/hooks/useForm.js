import { useState, useCallback } from 'react';

export function useForm(initialValues, validate, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: newValue }));
    
    if (validate) {
      const error = validate(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validate]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validate) {
      const error = validate(name, values[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validate, values]);

  const validateForm = useCallback(() => {
    if (!validate) return true;
    
    const newErrors = {};
    let isValid = true;
    
    Object.keys(values).forEach(key => {
      const error = validate(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [validate, values]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Отмечаем все поля как тронутые
    const allTouched = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Валидация
    if (!validateForm()) {
      console.log('❌ Валидация не пройдена');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      // Сброс формы после успешной отправки
      setValues(initialValues);
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error('Ошибка отправки:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, initialValues]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues
  };
}