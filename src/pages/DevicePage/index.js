import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CRow, CCol } from '@coreui/react';
import DeviceHealth from 'components/DeviceHealth';
import DeviceConfiguration from 'components/DeviceConfiguration';
import CommandHistory from 'components/CommandHistory';
import DeviceLogs from 'components/DeviceLogs';
import DeviceStatisticsCard from 'components/InterfaceStatistics';
import DeviceActionCard from 'components/DeviceActionCard';
import DeviceStatusCard from 'components/DeviceStatusCard';

const DevicePage = () => {
  const dispatch = useDispatch();

  const { deviceId } = useParams();
  const previouslySelectedDeviceId = useSelector((state) => state.selectedDeviceId);

  useEffect(() => {
    if (deviceId && deviceId !== previouslySelectedDeviceId)
      dispatch({ type: 'set', selectedDeviceId: deviceId });
  }, [deviceId]);

  return (
    <>
      <div className="App">
        <CRow>
          <CCol xs="12" sm="6">
            <DeviceStatusCard selectedDeviceId={deviceId} />
            <DeviceConfiguration selectedDeviceId={deviceId} />
          </CCol>
          <CCol xs="12" sm="6">
            <DeviceLogs selectedDeviceId={deviceId} />
            <DeviceHealth selectedDeviceId={deviceId} />
            <DeviceActionCard selectedDeviceId={deviceId} />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <DeviceStatisticsCard selectedDeviceId={deviceId} />
            <CommandHistory selectedDeviceId={deviceId} />
          </CCol>
        </CRow>
      </div>
    </>
  );
};

export default DevicePage;
