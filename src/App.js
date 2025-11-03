import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import jwtDecode from 'jwt-decode'
import ProtectedRoute from './routes/ProtectedRoute' // ✅ chỉ import 1 lần
import * as UserService from '../src/services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/sildes/userSlide'
import Loading from './components/LoadingComponent/Loading'

import { SocketProvider } from './contexts/SocketContext'
import ChatComponent from './components/ChatComponent/ChatComponent'

// 🎯 Import Stripe
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// ⚙️ Khởi tạo Stripe Public Key (test key từ Stripe Dashboard)
const stripePromise = loadStripe(
  'pk_test_51SI7EV4jpDA4s9fLxgfls2fsOOxJTewAkZ6MnRE9pQctOI0D8LNnBZzhXfhJkoN5crA5EUEbJ0T1EFAbLQnuQrBX00Gfj08BJL'
)

function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    setIsLoading(true)
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id && storageData) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
    setIsLoading(false)
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token)
      dispatch(updateUser({ ...res?.data, access_token: token }))
    } catch (err) {
      console.error('Get user details error:', err)
    }
  }

  return (
    <Loading isLoading={isLoading}>
      {/* 🧾 Stripe bọc toàn bộ ứng dụng */}
      <Elements stripe={stripePromise}>
        {/* 💬 Bọc trong SocketProvider để chat hoạt động */}
        <SocketProvider>
          <Router>
            <Routes>
              {routes.map((route) => {
                const Page = route.page

                // ✅ Nếu là route admin (private)
                if (route.isPrivate) {
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <ProtectedRoute>
                          <DefaultComponent
                            isShowHeader={route.isShowHeader}
                            isShowFooter={route.isShowFooter}
                          >
                            <Page />
                          </DefaultComponent>
                        </ProtectedRoute>
                      }
                    />
                  )
                }

                // ✅ Route công khai
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <DefaultComponent
                        isShowHeader={route.isShowHeader}
                        isShowFooter={route.isShowFooter}
                      >
                        <Page />
                      </DefaultComponent>
                    }
                  />
                )
              })}
            </Routes>

            {/* 💬 Chat chỉ hiện với user thường */}
            {user?.id && !user?.isAdmin && <ChatComponent />}
          </Router>
        </SocketProvider>
      </Elements>
    </Loading>
  )
}

export default App
