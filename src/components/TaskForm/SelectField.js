import React, { useState } from 'react';

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  options = [],
  variant = 'select',
  required = false,
  disabled = false
}) {
  const [focused, setFocused] = useState(false);

  if (variant === 'radio') {
    return (
      <div className="form-group radio-group">
        <label>
          {label}
          {required && <span className="required">*</span>}
        </label>
        <div className="radio-options">
          {options.map(option => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={disabled}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  return (
    <div className="form-group">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-select"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default SelectField;