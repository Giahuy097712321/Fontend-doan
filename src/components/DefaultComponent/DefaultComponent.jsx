import React from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import FooterComponent from '../FooterComponent/FooterComponent'

const DefaultComponent = ({ children, isShowHeader, isShowFooter }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ✅ Header */}
      {isShowHeader && <HeaderComponent />}

      {/* ✅ Main content */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* ✅ Footer */}
      {isShowFooter && <FooterComponent />}
    </div>
  )
}

export default DefaultComponent
