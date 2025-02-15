import React, { useEffect, useMemo, useState } from 'react';
import { Box, Center, Flex, Heading, Spacer, Spinner, useDisclosure } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import VenueAnalyticsHeader from './Header';
import VenueDashboardTableModal from './TableModal';
import RefreshButton from 'components/Buttons/RefreshButton';
import CardBody from 'components/Card/CardBody';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetAnalyticsBoardDevices } from 'hooks/Network/Analytics';

const propTypes = {
  boardId: PropTypes.string.isRequired,
};

const VenueDashboard = ({ boardId }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure(false);
  const [tableOptions, setTableOptions] = useState(null);
  const { data: devices, isFetching, refetch } = useGetAnalyticsBoardDevices({ id: boardId });

  const handleRefreshClick = () => {
    refetch();
  };

  const openModal = (newOptions) => {
    setTableOptions(newOptions);
    onOpen();
  };

  const parsedData = useMemo(() => {
    if (!devices) return {};

    const finalData = {
      totalDevices: 0,
      connectedPercentage: 0,
      connectedDevices: 0,
      disconnectedDevices: 0,
      avgMemoryUsed: 0,
      avgHealth: 0,
      avgUptime: 0,
      twoGAssociations: 0,
      fiveGAssociations: 0,
      sixGAssociations: 0,
      deviceTypeTotals: {},
      deviceFirmwareTotals: {},
    };
    try {
      // Temporary values
      const finalDevices = [];
      const ignoredDevices = [];
      let totalHealth = 0;
      let totalUptime = 0;
      let totalMemory = 0;

      for (let i = 0; i < devices.length; i += 1) {
        const device = devices[i];
        if (device.deviceType !== '') {
          const splitFirmware = device.lastFirmware.split(' / ');
          let firmware = splitFirmware.length > 1 ? splitFirmware[1] : device.lastFirmware;
          if (device.lastFirmware.length === 0) firmware = 'Unknown';

          if (finalData.deviceFirmwareTotals[firmware]) finalData.deviceFirmwareTotals[firmware] += 1;
          else finalData.deviceFirmwareTotals[firmware] = 1;

          if (finalData.deviceTypeTotals[device.deviceType]) finalData.deviceTypeTotals[device.deviceType] += 1;
          else finalData.deviceTypeTotals[device.deviceType] = 1;

          if (device.associations_2g > 0) finalData.twoGAssociations += device.associations_2g;
          if (device.associations_5g > 0) finalData.fiveGAssociations += device.associations_5g;
          if (device.associations_6g > 0) finalData.sixGAssociations += device.associations_6g;

          device.memory = Math.round(device.memory);

          if (device.connected) {
            finalData.connectedDevices += 1;
            totalHealth += device.health;
            totalMemory += device.memory;
            totalUptime += device.uptime;
          } else finalData.disconnectedDevices += 1;

          finalDevices.push(device);
        } else {
          ignoredDevices.push(device);
          if (device.connected) {
            finalData.connectedDevices += 1;
            totalMemory += Math.round(device.memory);
            totalUptime += device.uptime;
          } else finalData.disconnectedDevices += 1;
          if (finalData.deviceFirmwareTotals.Unknown > 0) finalData.deviceFirmwareTotals.Unknown += 1;
          else finalData.deviceFirmwareTotals.Unknown = 1;
          if (finalData.deviceTypeTotals.Unknown > 0) finalData.deviceTypeTotals.Unknown += 1;
          else finalData.deviceTypeTotals.Unknown = 1;
        }
      }
      finalData.totalDevices = finalDevices.length + ignoredDevices.length;
      finalData.connectedPercentage = Math.round(
        (finalData.connectedDevices / Math.max(1, finalData.totalDevices)) * 100,
      );
      finalData.devices = finalDevices;
      finalData.avgHealth = Math.round(totalHealth / Math.max(1, finalData.connectedDevices));
      finalData.avgUptime = Math.round(totalUptime / Math.max(1, finalData.connectedDevices));
      finalData.avgMemoryUsed = Math.round(totalMemory / Math.max(1, finalData.connectedDevices));
      finalData.devices = finalDevices;
      finalData.ignoredDevices = ignoredDevices;
      return finalData;
    } catch (e) {
      return finalData;
    }
  }, [devices]);

  useEffect(() => {
    if (!isOpen) setTableOptions(null);
  }, [isOpen]);

  return !devices ? (
    <Center my={6}>
      <Spinner size="xl" />
    </Center>
  ) : (
    <>
      <Flex px={2} pt={2}>
        <Heading size="md" my="auto">
          {parsedData?.totalDevices} {t('devices.title')}
        </Heading>
        <Spacer />
        <VenueDashboardTableModal
          data={parsedData}
          tableOptions={tableOptions}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
        <RefreshButton onClick={handleRefreshClick} isLoading={isFetching} ml={2} isCompact />
      </Flex>
      <CardBody p={4}>
        <LoadingOverlay isLoading={isFetching}>
          <Box w="100%">
            <VenueAnalyticsHeader data={parsedData} openModal={openModal} />
          </Box>
        </LoadingOverlay>
      </CardBody>
    </>
  );
};

VenueDashboard.propTypes = propTypes;
export default VenueDashboard;
