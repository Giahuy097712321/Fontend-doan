import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import jwtDecode from 'jwt-decode'

import * as UserService from '../src/services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/sildes/userSlide'
import Loading from './components/LoadingComponent/Loading'

import { SocketProvider } from './contexts/SocketContext'
import ChatComponent from './components/ChatComponent/ChatComponent'

// 🎯 Import Stripe
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// ⚙️ Khởi tạo Stripe Public Key từ biến môi trường
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51SI7EV4jpDA4s9fLxgfls2fsOOxJTewAkZ6MnRE9pQctOI0D8LNnBZzhXfhJkoN5crA5EUEbJ0T1EFAbLQnuQrBX00Gfj08BJL')

function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true) // Bắt đầu với true
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true)
        const { storageData, decoded } = handleDecoded()

        if (decoded?.id && storageData) {
          await handleGetDetailsUser(decoded?.id, storageData)
        }
      } catch (error) {
        console.error('App initialization error:', error)
      } finally {
        // Đảm bảo loading luôn tắt sau 2 giây dù có lỗi hay không
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      }
    }

    initializeApp()
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      try {
        storageData = JSON.parse(storageData)
        decoded = jwtDecode(storageData)
      } catch (error) {
        console.error('Token decoding error:', error)
        // Clear invalid token
        localStorage.removeItem('access_token')
      }
    }
    return { decoded, storageData }
  }

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token)
      if (res?.data) {
        dispatch(updateUser({ ...res.data, access_token: token }))
      }
    } catch (err) {
      console.error('Get user details error:', err)
      // Nếu token không hợp lệ, clear nó
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token')
      }
    }
  }

  // Component bảo vệ route
  const ProtectedRoute = ({ children, isPrivate, requireAdmin }) => {
    if (isPrivate && !user?.id) {
      return null // Hoặc redirect đến login page
    }

    if (requireAdmin && !user?.isAdmin) {
      return null // Hoặc redirect đến unauthorized page
    }

    return children
  }

  return (
    <Loading isLoading={isLoading}>
      {/* 🧾 Bọc toàn bộ app trong Elements để Stripe hoạt động */}
      <Elements stripe={stripePromise}>
        {/* 💬 Bọc toàn bộ app trong SocketProvider để chat hoạt động */}
        <SocketProvider>
          <Router>
            <Routes>
              {routes.map((route) => {
                const Page = route.page
                const Layout = route.layout || Fragment

                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <ProtectedRoute
                        isPrivate={route.isPrivate}
                        requireAdmin={route.requireAdmin}
                      >
                        <Layout>
                          <DefaultComponent
                            isShowHeader={route.isShowHeader}
                            isShowFooter={route.isShowFooter}
                          >
                            <Page />
                          </DefaultComponent>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                )
              })}

              {/* Route fallback cho 404 - chỉ thêm nếu cần */}
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>

            {/* 💬 Hiển thị Chat Component cho user thường (không phải admin) */}
            {user?.id && !user?.isAdmin && <ChatComponent />}

            {/* 🔍 Component debug cho môi trường development */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{
                position: 'fixed',
                bottom: '10px',
                left: '10px',
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '12px',
                zIndex: 9999
              }}>
                Env: {process.env.NODE_ENV} |
                User: {user?.id ? 'Logged In' : 'Guest'} |
                Admin: {user?.isAdmin ? 'Yes' : 'No'}
              </div>
            )}
          </Router>
        </SocketProvider>
      </Elements>
    </Loading>
  )
}

export default App