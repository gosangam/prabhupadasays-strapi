import * as React from "react";
import { useIntl } from "react-intl";
import { Field, TextInput } from "@strapi/design-system";
import { Link } from "@strapi/design-system";
import { ExternalLink } from "@strapi/icons";

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
  error?: {
    id: string;
    defaultMessage: string;
  };
  intlLabel: {
    id: string;
    defaultMessage: string;
  };
  name: string;
  onChange: (event: {
    target: { name: string; value: string; type: string };
  }) => void;
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
    value = "",
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
  const errorMessage = error
    ? formatMessage(error)
    : !isValid && value
      ? "Please enter a valid URL"
      : undefined;

  return (
    <Field.Root
      name={name}
      error={errorMessage}
      hint={hint}
      required={required}
    >
      <Field.Label>{formatMessage(intlLabel)}</Field.Label>

      <TextInput
        ref={ref}
        type="url"
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={
          placeholder ? formatMessage(placeholder) : "https://example.com"
        }
        hasError={!!errorMessage}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? `${name}-error` : undefined}
      />

      {errorMessage && <Field.Error />}

      {hint && !errorMessage && <Field.Hint />}

      {value && isValid && (
        <div style={{ marginTop: "8px" }}>
          <Link href={value} isExternal startIcon={<ExternalLink />}>
            Open link in new tab
          </Link>
        </div>
      )}
    </Field.Root>
  );
});

Input.displayName = "UrlFieldInput";

export default Input;
