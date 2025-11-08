// src/components/SocketStatus/SocketStatus.jsx
import React from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { Badge, Tooltip, Button } from 'antd';
import {
    WifiOutlined,
    DisconnectOutlined,
    SyncOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const SocketStatus = () => {
    const { isConnected, connectionAttempts, reconnect } = useSocket();

    const getStatusInfo = () => {
        if (isConnected) {
            return {
                icon: <WifiOutlined />,
                color: '#52c41a',
                text: 'Kết nối ổn định',
                status: 'connected'
            };
        } else if (connectionAttempts > 0) {
            return {
                icon: <SyncOutlined spin />,
                color: '#faad14',
                text: `Đang kết nối lại... (${connectionAttempts})`,
                status: 'reconnecting'
            };
        } else {
            return {
                icon: <DisconnectOutlined />, // Sử dụng DisconnectOutlined thay vì WifiOffOutlined
                color: '#ff4d4f',
                text: 'Mất kết nối',
                status: 'disconnected'
            };
        }
    };

    const status = getStatusInfo();

    const handleReconnect = () => {
        reconnect();
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tooltip title={status.text}>
                <Badge
                    count={!isConnected ? connectionAttempts : 0}
                    style={{
                        backgroundColor: status.color,
                        fontSize: '10px'
                    }}
                    size="small"
                >
                    <span style={{
                        color: status.color,
                        fontSize: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {status.icon}
                    </span>
                </Badge>
            </Tooltip>

            {!isConnected && connectionAttempts === 0 && (
                <Button
                    size="small"
                    icon={<SyncOutlined />}
                    onClick={handleReconnect}
                    type="primary"
                    danger
                >
                    Kết nối lại
                </Button>
            )}
        </div>
    );
};

export default SocketStatus;