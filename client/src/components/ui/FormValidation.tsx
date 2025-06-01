import React from 'react';
import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Form field wrapper with validation
interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  children?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export function FormField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  children,
  description,
  disabled = false
}: FormFieldProps<T>) {
  const error = form.formState.errors[name];
  const isValid = form.formState.dirtyFields[name] && !error;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        {children || (
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              ${error ? 'border-red-500 focus:border-red-500' : ''}
              ${isValid ? 'border-green-500 focus:border-green-500' : ''}
            `}
            {...form.register(name)}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : description ? `${name}-description` : undefined}
          />
        )}
        
        {/* Validation icon */}
        {form.formState.dirtyFields[name] && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p id={`${name}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p id={`${name}-error`} className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}

// Textarea field with validation
export function FormTextareaField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  required = false,
  description,
  disabled = false,
  rows = 4
}: FormFieldProps<T> & { rows?: number }) {
  const error = form.formState.errors[name];
  const isValid = form.formState.dirtyFields[name] && !error;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Textarea
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${isValid ? 'border-green-500 focus:border-green-500' : ''}
          `}
          {...form.register(name)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : description ? `${name}-description` : undefined}
        />
      </div>

      {description && (
        <p id={`${name}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}

      {error && (
        <p id={`${name}-error`} className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}

// Form submission button with loading state
interface FormSubmitButtonProps {
  isSubmitting: boolean;
  isValid: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormSubmitButton({
  isSubmitting,
  isValid,
  children,
  className = ''
}: FormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting || !isValid}
      className={className}
    >
      {isSubmitting && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      )}
      {children}
    </Button>
  );
}

// Form error summary
interface FormErrorSummaryProps {
  errors: Record<string, any>;
  title?: string;
}

export function FormErrorSummary({ errors, title = "Kérjük, javítsa a következő hibákat:" }: FormErrorSummaryProps) {
  const errorCount = Object.keys(errors).length;
  
  if (errorCount === 0) return null;

  return (
    <Alert variant="destructive" role="alert" aria-live="polite">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">{title}</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                {error?.message || `Hiba a(z) ${field} mezőben`}
              </li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Success message component
interface FormSuccessMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function FormSuccessMessage({ message, onDismiss }: FormSuccessMessageProps) {
  return (
    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800 dark:text-green-200">
        <div className="flex items-center justify-between">
          <span>{message}</span>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-auto p-0 text-green-600 hover:text-green-800"
            >
              ✕
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Form info message
interface FormInfoMessageProps {
  message: string;
  title?: string;
}

export function FormInfoMessage({ message, title }: FormInfoMessageProps) {
  return (
    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        {title && <p className="font-medium mb-1">{title}</p>}
        <p>{message}</p>
      </AlertDescription>
    </Alert>
  );
}

// Hungarian form validation messages
export const validationMessages = {
  required: 'Ez a mező kötelező',
  email: 'Érvényes email címet adjon meg',
  minLength: (min: number) => `Legalább ${min} karakter szükséges`,
  maxLength: (max: number) => `Maximum ${max} karakter megengedett`,
  pattern: 'Érvénytelen formátum',
  phone: 'Érvényes telefonszámot adjon meg',
  password: 'A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell számot és speciális karaktert',
  confirmPassword: 'A jelszavak nem egyeznek',
  url: 'Érvényes URL címet adjon meg',
  number: 'Számot adjon meg',
  positive: 'Pozitív számot adjon meg',
  integer: 'Egész számot adjon meg'
};

// Common validation rules
export const validationRules = {
  email: {
    required: validationMessages.required,
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: validationMessages.email
    }
  },
  phone: {
    pattern: {
      value: /^(\+36|06)[1-9][0-9]{7,8}$/,
      message: validationMessages.phone
    }
  },
  password: {
    required: validationMessages.required,
    minLength: {
      value: 8,
      message: validationMessages.minLength(8)
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: validationMessages.password
    }
  },
  url: {
    pattern: {
      value: /^https?:\/\/.+\..+/,
      message: validationMessages.url
    }
  }
};