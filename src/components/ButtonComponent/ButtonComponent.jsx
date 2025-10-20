import { Button } from 'antd'
import React from 'react'

const ButtonComponent = ({ 
    size, 
    styleButton, 
    styleTextButton, 
    textButton, 
    disabled, 
    bordered, // loại bỏ không truyền cho Button
    ...rests 
}) => {
    return (
        <Button
            style={{
                ...styleButton,
                background: disabled ? '#ccc' : styleButton?.background
            }}
            size={size}
            disabled={disabled}
            {...rests} // chỉ truyền props hợp lệ
        >
            <span style={styleTextButton}>{textButton}</span>
        </Button>
    )
}

export default ButtonComponent
