import {
    CCard,
    CCardTitle,
    CCardBody,
    CDataTable,
    CCardHeader
  } from '@coreui/react';
import React from 'react';
import 'react-widgets/styles.css';

const WifiChannelCard = ({ channel }) => {
    const columns = [
        { key: 'SSID', _style: { width: '70%' }},
        { key: 'Signal' },
    ];

    return (
        <CCard>
            <CCardHeader>
                <CCardTitle>
                    Channel #{channel.channel}
                </CCardTitle>
            </CCardHeader>
            <CCardBody>
                <CDataTable
                    items={channel.devices}
                    fields={columns}
                    style={{ color: 'white' }}
                />
            </CCardBody>
        </CCard>
    );
}

export default WifiChannelCard;