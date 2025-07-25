import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// Base form styles
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

// Label component
const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
  
  ${props => props.required && css`
    &::after {
      content: ' *';
      color: ${props.theme.colors.error};
    }
  `}
  
  ${props => props.disabled && css`
    color: ${props.theme.colors.textMuted};
  `}
`;

// Base input styles
const baseInputStyles = css`
  width: 100%;
  padding: 0.75rem;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.sans};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};
  
  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.focus};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.disabled};
    color: ${props => props.theme.colors.textMuted};
    cursor: not-allowed;
  }
  
  ${props => props.error && css`
    border-color: ${props.theme.colors.error};
    
    &:focus {
      border-color: ${props.theme.colors.error};
      box-shadow: 0 0 0 3px ${props.theme.colors.error}20;
    }
  `}
  
  ${props => props.success && css`
    border-color: ${props.theme.colors.success};
  `}
`;

// Input component
const StyledInput = styled.input`
  ${baseInputStyles}
  
  ${props => props.size === 'sm' && css`
    padding: 0.5rem;
    font-size: ${props.theme.typography.fontSize.sm};
  `}
  
  ${props => props.size === 'lg' && css`
    padding: 1rem;
    font-size: ${props.theme.typography.fontSize.lg};
  `}
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  ${props => props.position === 'right' ? 'right: 0.75rem;' : 'left: 0.75rem;'}
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textMuted};
  pointer-events: ${props => props.clickable ? 'auto' : 'none'};
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  ${props => props.clickable && css`
    &:hover {
      color: ${props.theme.colors.text};
    }
  `}
`;

const Input = React.forwardRef(({
  label,
  error,
  success,
  helperText,
  required,
  leftIcon,
  rightIcon,
  onRightIconClick,
  size = 'md',
  className,
  style,
  ...props
}, ref) => {
  const hasLeftIcon = !!leftIcon;
  const hasRightIcon = !!rightIcon;

  return (
    <FormGroup className={className} style={style}>
      {label && (
        <Label required={required} disabled={props.disabled}>
          {label}
        </Label>
      )}
      <InputWrapper>
        {hasLeftIcon && (
          <InputIcon position="left">
            {leftIcon}
          </InputIcon>
        )}
        <StyledInput
          ref={ref}
          error={error}
          success={success}
          size={size}
          style={{
            paddingLeft: hasLeftIcon ? '2.5rem' : undefined,
            paddingRight: hasRightIcon ? '2.5rem' : undefined
          }}
          {...props}
        />
        {hasRightIcon && (
          <InputIcon 
            position="right" 
            clickable={!!onRightIconClick}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </InputIcon>
        )}
      </InputWrapper>
      {(error || helperText) && (
        <HelperText error={!!error}>
          {error || helperText}
        </HelperText>
      )}
    </FormGroup>
  );
});

Input.displayName = 'Input';

// Password input component
export const PasswordInput = React.forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      rightIcon={showPassword ? <EyeSlashIcon /> : <EyeIcon />}
      onRightIconClick={() => setShowPassword(!showPassword)}
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

// TextArea component
const StyledTextArea = styled.textarea`
  ${baseInputStyles}
  min-height: 100px;
  resize: vertical;
  font-family: ${props => props.theme.typography.fontFamily.sans};
  line-height: 1.5;
  
  ${props => props.size === 'sm' && css`
    min-height: 80px;
    padding: 0.5rem;
    font-size: ${props.theme.typography.fontSize.sm};
  `}
  
  ${props => props.size === 'lg' && css`
    min-height: 120px;
    padding: 1rem;
    font-size: ${props.theme.typography.fontSize.lg};
  `}
`;

export const TextArea = React.forwardRef(({
  label,
  error,
  success,
  helperText,
  required,
  size = 'md',
  className,
  style,
  ...props
}, ref) => (
  <FormGroup className={className} style={style}>
    {label && (
      <Label required={required} disabled={props.disabled}>
        {label}
      </Label>
    )}
    <StyledTextArea
      ref={ref}
      error={error}
      success={success}
      size={size}
      {...props}
    />
    {(error || helperText) && (
      <HelperText error={!!error}>
        {error || helperText}
      </HelperText>
    )}
  </FormGroup>
));

TextArea.displayName = 'TextArea';

// Select component
const StyledSelect = styled.select`
  ${baseInputStyles}
  cursor: pointer;
  
  &:invalid {
    color: ${props => props.theme.colors.textMuted};
  }
`;

export const Select = React.forwardRef(({
  label,
  error,
  success,
  helperText,
  required,
  options = [],
  placeholder,
  size = 'md',
  className,
  style,
  ...props
}, ref) => (
  <FormGroup className={className} style={style}>
    {label && (
      <Label required={required} disabled={props.disabled}>
        {label}
      </Label>
    )}
    <StyledSelect
      ref={ref}
      error={error}
      success={success}
      size={size}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </StyledSelect>
    {(error || helperText) && (
      <HelperText error={!!error}>
        {error || helperText}
      </HelperText>
    )}
  </FormGroup>
));

Select.displayName = 'Select';

// Checkbox component
const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  
  ${props => props.disabled && css`
    cursor: not-allowed;
    opacity: 0.6;
  `}
`;

const CheckboxInput = styled.input`
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: ${props => props.theme.colors.primary};
  cursor: pointer;
  
  ${props => props.disabled && css`
    cursor: not-allowed;
  `}
`;

const CheckboxLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  line-height: 1.4;
  
  ${props => props.disabled && css`
    cursor: not-allowed;
    color: ${props.theme.colors.textMuted};
  `}
`;

export const Checkbox = React.forwardRef(({
  label,
  error,
  helperText,
  className,
  style,
  disabled,
  ...props
}, ref) => (
  <FormGroup className={className} style={style}>
    <CheckboxWrapper disabled={disabled}>
      <CheckboxInput
        ref={ref}
        type="checkbox"
        disabled={disabled}
        {...props}
      />
      {label && (
        <CheckboxLabel disabled={disabled}>
          {label}
        </CheckboxLabel>
      )}
    </CheckboxWrapper>
    {(error || helperText) && (
      <HelperText error={!!error}>
        {error || helperText}
      </HelperText>
    )}
  </FormGroup>
));

Checkbox.displayName = 'Checkbox';

// Radio component
const RadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  ${props => props.disabled && css`
    cursor: not-allowed;
    opacity: 0.6;
  `}
`;

const RadioInput = styled.input`
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: ${props => props.theme.colors.primary};
  cursor: pointer;
  
  ${props => props.disabled && css`
    cursor: not-allowed;
  `}
`;

const RadioLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  
  ${props => props.disabled && css`
    cursor: not-allowed;
    color: ${props.theme.colors.textMuted};
  `}
`;

export const RadioGroup = ({
  label,
  name,
  options = [],
  value,
  onChange,
  error,
  helperText,
  required,
  disabled,
  className,
  style
}) => (
  <FormGroup className={className} style={style}>
    {label && (
      <Label required={required} disabled={disabled}>
        {label}
      </Label>
    )}
    <RadioWrapper>
      {options.map((option) => (
        <RadioOption key={option.value} disabled={disabled || option.disabled}>
          <RadioInput
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            disabled={disabled || option.disabled}
          />
          <RadioLabel disabled={disabled || option.disabled}>
            {option.label}
          </RadioLabel>
        </RadioOption>
      ))}
    </RadioWrapper>
    {(error || helperText) && (
      <HelperText error={!!error}>
        {error || helperText}
      </HelperText>
    )}
  </FormGroup>
);

// File input component
const FileInputWrapper = styled.div`
  position: relative;
`;

const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.surface};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.hover};
  }
  
  ${props => props.dragOver && css`
    border-color: ${props.theme.colors.primary};
    background: ${props.theme.colors.focus};
  `}
`;

const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const FileInput = React.forwardRef(({
  label,
  error,
  helperText,
  required,
  children = 'Choose file',
  multiple,
  accept,
  className,
  style,
  onChange,
  ...props
}, ref) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    onChange?.(e);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
    
    // Create a synthetic event for onChange
    const syntheticEvent = {
      target: { files }
    };
    onChange?.(syntheticEvent);
  };

  return (
    <FormGroup className={className} style={style}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      <FileInputWrapper>
        <FileInputLabel
          dragOver={dragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <HiddenFileInput
            ref={ref}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleChange}
            {...props}
          />
          {children}
        </FileInputLabel>
        {selectedFiles.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {selectedFiles.map((file, index) => (
              <div key={index}>{file.name}</div>
            ))}
          </div>
        )}
      </FileInputWrapper>
      {(error || helperText) && (
        <HelperText error={!!error}>
          {error || helperText}
        </HelperText>
      )}
    </FormGroup>
  );
});

FileInput.displayName = 'FileInput';

// Helper text component
const HelperText = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.error ? props.theme.colors.error : props.theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

// Search input component
export const SearchInput = React.forwardRef(({
  onSearch,
  onClear,
  clearable = true,
  searchIcon = '🔍',
  clearIcon = '✕',
  ...props
}, ref) => {
  const [value, setValue] = useState(props.value || '');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    props.onChange?.(e);
  };

  const handleClear = () => {
    setValue('');
    onClear?.();
    const syntheticEvent = {
      target: { value: '' }
    };
    props.onChange?.(syntheticEvent);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch?.(value);
    }
    props.onKeyDown?.(e);
  };

  return (
    <Input
      ref={ref}
      type="search"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      leftIcon={<span>{searchIcon}</span>}
      rightIcon={clearable && value ? (
        <button
          type="button"
          onClick={handleClear}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {clearIcon}
        </button>
      ) : null}
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

// Form validation hook
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) return error;
    }
    return '';
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Export main components
export {
  FormContainer,
  FormGroup,
  FormRow,
  Label,
  Input
};

export default Input;