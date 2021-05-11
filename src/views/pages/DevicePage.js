import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    CRow,
    CCol
  } from '@coreui/react'
import DeviceHealth from '../../components/DeviceHealth';
import DeviceConfiguration from '../../components/DeviceConfiguration';
import DeviceActions from '../../components/DeviceActions'

const DevicePage = (props) => {
    const dispatch = useDispatch();

    //Storing the deviceId in the store
    let selectedDeviceId = useSelector(state => state.selectedDeviceId);
    let { deviceId } = useParams();

    if(!selectedDeviceId || selectedDeviceId !== deviceId){
        dispatch({type: 'set', selectedDeviceId: deviceId});
        selectedDeviceId = deviceId;
    }

    useEffect(() => {
        dispatch({type: 'set', selectedDevice: null, selectedDeviceId: null});
    },[]);

    return (
        <>
        <div className="App">
            <CRow>
                <CCol xs='12' sm='6'>
                    <DeviceConfiguration/>
                </CCol>
                <CCol xs='12' sm='6'>
                    <DeviceHealth/>
                    <DeviceActions/>
                </CCol >
            </CRow>
        </div>
        </>
      )
}

export default DevicePage;