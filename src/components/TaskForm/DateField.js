import React, { useState } from 'react';

function DateField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  variant = 'date',
  required = false,
  disabled = false,
  minDate = null,
  maxDate = null
}) {
  const [focused, setFocused] = useState(false);

  const getMinDate = () => {
    if (minDate === 'today') {
      return new Date().toISOString().split('T')[0];
    }
    return minDate;
  };

  return (
    <div className="form-group">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <input
        type={variant === 'date' ? 'date' : 'datetime-local'}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setFocused(false);
          if (onBlur) onBlur(e);
        }}
        onFocus={() => setFocused(true)}
        disabled={disabled}
        className={`form-input ${error ? 'error' : ''}`}
        min={getMinDate()}
        max={maxDate}
      />
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default DateField;