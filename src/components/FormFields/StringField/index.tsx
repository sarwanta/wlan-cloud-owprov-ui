import React, { useCallback } from 'react';
import { LayoutProps } from '@chakra-ui/react';
import StringInput from './StringInput';
import useFastField from 'hooks/useFastField';
import { FieldProps } from 'models/Form';

interface Props extends FieldProps, LayoutProps {
  formatValue?: (value: string) => string;
  hideButton?: boolean;
}

const StringField: React.FC<Props> = ({
  name,
  isDisabled = false,
  label,
  hideButton = false,
  isRequired = false,
  element,
  formatValue,
  isArea = false,
  emptyIsUndefined = false,
  definitionKey,
  ...props
}) => {
  const { value, error, isError, onChange, onBlur } = useFastField<string | undefined>({ name });

  const onFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (emptyIsUndefined && e.target.value.length === 0) onChange(undefined);
      else onChange(formatValue ? formatValue(e.target.value) : e.target.value);
    },
    [onChange],
  );

  return (
    <StringInput
      label={label ?? name}
      value={value}
      onChange={onFieldChange}
      onBlur={onBlur}
      isError={isError}
      error={error}
      hideButton={hideButton}
      isRequired={isRequired}
      element={element}
      isArea={isArea}
      isDisabled={isDisabled}
      definitionKey={definitionKey}
      {...props}
    />
  );
};

export default React.memo(StringField);
