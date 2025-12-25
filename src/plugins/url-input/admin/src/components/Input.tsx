import * as React from 'react';
import { useIntl } from 'react-intl';
import { Field, TextInput, Link } from '@strapi/design-system';
import { ExternalLink } from '@strapi/icons';

interface InputProps {
  attribute: {
    type: string;
    customField: string;
  };
  description?: {
    id: string;
    defaultMessage: string;
  };
  disabled?: boolean;
  error?: string;
  intlLabel: {
    id: string;
    defaultMessage: string;
  };
  name: string;
  onChange: (event: { target: { name: string; value: string; type: string } }) => void;
  placeholder?: {
    id: string;
    defaultMessage: string;
  };
  required?: boolean;
  value?: string;
  contentTypeUID: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    attribute,
    disabled = false,
    error,
    intlLabel,
    name,
    onChange,
    required = false,
    value = '',
    placeholder,
    hint,
  } = props;

  const { formatMessage } = useIntl();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      target: {
        name,
        type: attribute.type,
        value: e.target.value,
      },
    });
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValid = validateUrl(value);

  // Safety check for localized strings
  const safeFormat = (messageObj?: { id: string; defaultMessage: string }, fallback?: string) => {
    if (messageObj?.id) {
      return formatMessage(messageObj);
    }
    return messageObj?.defaultMessage || fallback || '';
  };

  const errorMessage = error
    ? error
    : !isValid && value
      ? formatMessage({
          id: 'url-field.validation.invalid',
          defaultMessage: 'Please enter a valid URL',
        })
      : undefined;

  return (
    <Field.Root name={name} error={errorMessage} hint={hint} required={required}>
      {/* SAFE LABEL */}
      <Field.Label>{safeFormat(intlLabel, name)}</Field.Label>

      <TextInput
        ref={ref}
        type="url"
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        /* SAFE PLACEHOLDER */
        placeholder={
          placeholder?.id
            ? formatMessage(placeholder)
            : formatMessage({
                id: 'url-field.placeholder.default',
                defaultMessage: 'https://example.com',
              })
        }
        hasError={!!errorMessage}
        aria-invalid={!!errorMessage}
      />

      {errorMessage && <Field.Error />}
      {hint && !errorMessage && <Field.Hint />}

      {value && isValid && (
        <div style={{ marginTop: '8px' }}>
          <Link href={value} isExternal startIcon={<ExternalLink />}>
            {formatMessage({
              id: 'url-field.open-link',
              defaultMessage: 'Open link in new tab',
            })}
          </Link>
        </div>
      )}
    </Field.Root>
  );
});

Input.displayName = 'UrlFieldInput';

export default Input;
