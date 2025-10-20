import { Checkbox, Rate } from 'antd'
import React from 'react'
import { WrapperContent, WrapperLabelText, WrapperTextValue } from './style'

const NavBarComponent = () => {
    const onChange = () => { }

    const ratingOptions = [5, 4, 3, 2, 1]
    const priceRanges = [
        'Dưới 5 triệu',
        '5 - 10 triệu',
        '10 - 15 triệu',
        '15 - 20 triệu',
        'Trên 20 triệu'
    ]

    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option, index) => (
                    <WrapperTextValue key={index}>{option}</WrapperTextValue>
                ))
            case 'checkbox':
                return (
                    <Checkbox.Group
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}
                        onChange={onChange}
                    >
                        {options.map((option, index) => (
                            <Checkbox
                                key={index}
                                value={option.value}
                                style={{ fontSize: '14px' }}
                            >
                                {option.label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            padding: '4px 0'
                        }}
                    >
                        <Rate
                            style={{ fontSize: '14px' }}
                            disabled
                            defaultValue={option}
                        />
                        <span style={{ fontSize: '13px', color: '#666' }}>
                            {`Từ ${option} sao`}
                        </span>
                    </div>
                ))
            case 'price':
                return options.map((option, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '8px 12px',
                            color: '#333',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginBottom: '8px',
                            border: '1px solid #e8e8e8'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#d70018'
                            e.target.style.color = '#fff'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#f8f9fa'
                            e.target.style.color = '#333'
                        }}
                    >
                        {option}
                    </div>
                ))
            default:
                return null
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <WrapperLabelText>Theo đánh giá</WrapperLabelText>
                <WrapperContent>
                    {renderContent('star', ratingOptions)}
                </WrapperContent>
            </div>

            <div>
                <WrapperLabelText>Khoảng giá</WrapperLabelText>
                <WrapperContent>
                    {renderContent('price', priceRanges)}
                </WrapperContent>
            </div>
        </div>
    )
}

export default NavBarComponent