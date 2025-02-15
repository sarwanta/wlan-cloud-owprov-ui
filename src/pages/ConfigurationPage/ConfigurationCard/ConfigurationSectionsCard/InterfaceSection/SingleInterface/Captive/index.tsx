import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { INTERFACE_CAPTIVE_SCHEMA } from '../../interfacesConstants';
import CaptiveForm from './Captive';
import useFastField from 'hooks/useFastField';

const Captive = ({ editing, index }: { editing: boolean; index: number }) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({ name: `configuration[${index}].captive` });

  const { isActive, variableBlock } = useMemo(
    () => ({
      isActive: value !== undefined,
      isUsingCustom: value !== undefined && value.__variableBlock === undefined,
      variableBlock: value?.__variableBlock,
    }),
    [value],
  );

  const onToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked) {
        onChange(undefined);
      } else {
        onChange(INTERFACE_CAPTIVE_SCHEMA(t, true).cast());
      }
    },
    [onChange],
  );

  return (
    <CaptiveForm
      isDisabled={!editing}
      namePrefix={`configuration[${index}].captive`}
      isActive={isActive}
      onToggle={onToggle}
      variableBlockId={variableBlock?.[0]}
    />
  );
};

export default React.memo(Captive);
