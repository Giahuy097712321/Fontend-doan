import { Rate } from 'antd'
import React from 'react'
import { WrapperContent } from './style'

const NavBarComponent = ({ selectedEfficiency, onEfficiencyChange }) => {

    const ratingOptions = [5, 4, 3, 2, 1]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <WrapperContent>
                {ratingOptions.map((option, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            backgroundColor: selectedEfficiency === option ? '#e6f7ff' : 'transparent',
                            border: selectedEfficiency === option ? '1px solid #1890ff' : '1px solid transparent',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => onEfficiencyChange(option)}
                    >
                        <Rate
                            style={{ fontSize: '14px' }}
                            disabled
                            value={option}
                        />
                        <span style={{
                            fontSize: '13px',
                            color: selectedEfficiency === option ? '#1890ff' : '#666',
                            fontWeight: selectedEfficiency === option ? '600' : '400'
                        }}>
                            {`Từ ${option}/5`}
                        </span>
                    </div>
                ))}
            </WrapperContent>
        </div>
    )
}

export default NavBarComponent