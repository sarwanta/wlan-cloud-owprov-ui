import React from 'react';
import { Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { ENCRYPTION_OPTIONS } from '../../../interfacesConstants';
import Radius from './Radius';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';

interface Props {
  editing: boolean;
  namePrefix: string;
  radiusPrefix: string;
  onProtoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  needIeee: boolean;
  isKeyNeeded: boolean;
  isUsingRadius: boolean;
  isPasspoint?: boolean;
  canUseRadius: boolean;
}

const EncryptionForm = ({
  editing,
  namePrefix,
  radiusPrefix,
  onProtoChange,
  needIeee,
  isKeyNeeded,
  isUsingRadius,
  isPasspoint,
  canUseRadius,
}: Props) => (
  <>
    <Flex mt={4}>
      <Heading size="md" borderBottom="1px solid">
        Authentication
      </Heading>
    </Flex>
    <SimpleGrid minChildWidth="300px" spacing="20px">
      <SelectField
        name={`${namePrefix}.proto`}
        label="protocol"
        definitionKey="interface.ssid.encryption.proto"
        options={ENCRYPTION_OPTIONS}
        isDisabled={!editing}
        isRequired
        onChange={onProtoChange}
        w="300px"
      />
      {isKeyNeeded && (
        <StringField
          name={`${namePrefix}.key`}
          label="key"
          definitionKey="interface.ssid.encryption.key"
          isDisabled={!editing}
          isRequired
          hideButton
        />
      )}
      {needIeee && (
        <SelectField
          name={`${namePrefix}.ieee80211w`}
          label="ieee80211w"
          definitionKey="interface.ssid.encryption.ieee80211w"
          options={[
            { value: 'disabled', label: 'disabled' },
            { value: 'optional', label: 'optional' },
            { value: 'required', label: 'required' },
          ]}
          isDisabled={!editing}
          isRequired
          w="120px"
        />
      )}
      <ToggleField
        name={`${namePrefix}.key-caching`}
        label="key-caching"
        definitionKey="interface.ssid.encryption.key-caching"
        isDisabled={!editing}
        defaultValue
      />
    </SimpleGrid>
    {(isUsingRadius || canUseRadius) && (
      <Radius editing={editing} namePrefix={radiusPrefix} isPasspoint={isPasspoint} isNotRequired={canUseRadius} />
    )}
  </>
);

export default React.memo(EncryptionForm);
