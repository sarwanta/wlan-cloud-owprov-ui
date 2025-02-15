import * as React from 'react';
import {
  Box,
  Center,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  SimpleGrid,
  Spacer,
  Spinner,
  useBoolean,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import SaveButton from 'components/Buttons/SaveButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import DeviceRulesField from 'components/CustomFields/DeviceRulesField';
import IpDetectionModalField from 'components/CustomFields/IpDetectionModalField';
import FormattedDate from 'components/FormattedDate';
import StringField from 'components/FormFields/StringField';
import { EntitySchema } from 'constants/formSchemas';
import { useGetEntity, useUpdateEntity } from 'hooks/Network/Entity';
import useFormRef from 'hooks/useFormRef';
import { AxiosError } from 'models/Axios';
import { Entity } from 'models/Entity';

type Props = {
  id: string;
};

const EntityDetails = ({ id }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = React.useState(uuid());
  const getEntity = useGetEntity({ id });
  const [editing, setEditing] = useBoolean();
  const { form, formRef } = useFormRef<Entity>();
  const updateEntity = useUpdateEntity({ id });

  React.useEffect(() => {
    setFormKey(uuid());
  }, [editing]);

  return (
    <Card>
      <CardHeader>
        <Heading my="auto" size="md">
          {t('common.details')}
        </Heading>
        <Spacer />
        <HStack spacing={2}>
          <SaveButton
            onClick={form.submitForm}
            isLoading={form.isSubmitting}
            isCompact
            isDisabled={!editing || !form.isValid || !form.dirty}
            hidden={!editing}
          />
          <ToggleEditButton
            toggleEdit={setEditing.toggle}
            isEditing={editing}
            isDisabled={getEntity.isFetching}
            isDirty={form.dirty}
            isCompact
          />
        </HStack>
      </CardHeader>
      <CardBody>
        <Box w="100%">
          {getEntity.data ? (
            <Formik
              innerRef={formRef}
              enableReinitialize
              key={formKey}
              initialValues={getEntity.data}
              validationSchema={EntitySchema(t)}
              onSubmit={({ name, description, sourceIP, deviceRules }, { setSubmitting, resetForm }) =>
                updateEntity.mutateAsync(
                  {
                    name,
                    description,
                    deviceRules,
                    sourceIP,
                  },
                  {
                    onSuccess: () => {
                      setSubmitting(false);
                      toast({
                        id: 'entity-update-success',
                        title: t('common.success'),
                        description: t('crud.success_update_obj', {
                          obj: t('entities.one'),
                        }),
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right',
                      });
                      resetForm();
                      setEditing.off();
                    },
                    onError: (e) => {
                      toast({
                        id: uuid(),
                        title: t('common.error'),
                        description: t('crud.error_update_obj', {
                          obj: t('entities.one'),
                          e: (e as AxiosError)?.response?.data?.ErrorDescription,
                        }),
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right',
                      });
                      setSubmitting(false);
                    },
                  },
                )
              }
            >
              <Form>
                <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(3, 1fr)" gap={4}>
                  <GridItem colSpan={1}>
                    <StringField name="name" label={t('common.name')} isDisabled={!editing} isRequired />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <StringField name="description" label={t('common.description')} isDisabled={!editing} />
                  </GridItem>
                </Grid>
                <SimpleGrid minChildWidth="200px" spacing={4} mt={2}>
                  <IpDetectionModalField name="sourceIP" isDisabled={!editing} />
                  <DeviceRulesField isDisabled={!editing} />
                  <FormControl>
                    <FormLabel>{t('common.modified')}</FormLabel>
                    <Box pt={1.5}>
                      <FormattedDate date={getEntity.data?.modified} />
                    </Box>
                  </FormControl>
                </SimpleGrid>
              </Form>
            </Formik>
          ) : (
            <Center my={6}>
              <Spinner size="xl" />
            </Center>
          )}
        </Box>
      </CardBody>
    </Card>
  );
};

export default EntityDetails;
