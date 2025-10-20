import React from 'react'
import { Button } from 'antd'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { SearchOutlined } from '@ant-design/icons'
const ButtonInputSearch = (props) => {
  const { size, placeholder, textButton, bordered, backgroundColorInput = '#fff', backgroundColorButton = 'rgb(13,92,182)'
    , colorButton = "#fff"
  } = props
  return (
    <div style={{ display: 'flex' }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{ backgroundColor: backgroundColorInput }}
        {...props} />

      <ButtonComponent
        size={size}

        styleButton={{ background: backgroundColorButton, border: !bordered && 'none' }}
        icon={<SearchOutlined style={{ color: colorButton }} />}
        textButton={textButton}
        styleTextButton={{ color: colorButton }}
      />



    </div>
  )
}

export default ButtonInputSearch