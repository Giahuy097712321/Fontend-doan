import { Rate } from 'antd'
import React from 'react'
import { WrapperContent } from './style'

const NavBarComponent = ({ selectedRating, onRatingChange }) => {

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
                            backgroundColor: selectedRating === option ? '#e6f7ff' : 'transparent',
                            border: selectedRating === option ? '1px solid #1890ff' : '1px solid transparent',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => onRatingChange(option)}
                    >
                        <Rate
                            style={{ fontSize: '14px' }}
                            disabled
                            value={option}
                        />
                        <span style={{
                            fontSize: '13px',
                            color: selectedRating === option ? '#1890ff' : '#666',
                            fontWeight: selectedRating === option ? '600' : '400'
                        }}>
                            {`Từ ${option} sao`}
                        </span>
                    </div>
                ))}
            </WrapperContent>
        </div>
    )
}

export default NavBarComponent