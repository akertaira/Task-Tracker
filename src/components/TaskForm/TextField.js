import React, { useState } from 'react';

function TextField({ 
  label, 
  name, 
  value, 
  onChange, 
  onBlur,
  error,
  type = 'text',
  multiline = false,
  rows = 3,
  placeholder = '',
  required = false,
  disabled = false,
  autoFocus = false,
  maxLength = 50
}) {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    onChange(e);
  };

  const InputComponent = multiline ? 'textarea' : 'input';
  const inputProps = multiline 
    ? { rows, value, onChange: handleChange, placeholder, disabled, autoFocus }
    : { type, value, onChange: handleChange, placeholder, disabled, autoFocus };

  return (
    <div className="form-group">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <InputComponent
        {...inputProps}
        name={name}
        className={`form-input ${error ? 'error' : ''}`}
        onBlur={(e) => {
          setFocused(false);
          if (onBlur) onBlur(e);
        }}
        onFocus={() => setFocused(true)}
        maxLength={maxLength}
      />
      
      {maxLength && !multiline && (
        <div className="char-counter">
          {charCount}/{maxLength}
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default TextField;