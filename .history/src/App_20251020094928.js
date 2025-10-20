import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import jwtDecode from 'jwt-decode'
import * as UserService from '../src/services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, resetUser } from './redux/sildes/userSlide'
import Loading from './components/LoadingComponent/Loading'

// 🎯 Import Stripe
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// ⚙️ Khởi tạo Stripe Public Key (test key từ Stripe Dashboard)
const stripePromise = loadStripe('pk_test_51SI7EV4jpDA4s9fLxgfls2fsOOxJTewAkZ6MnRE9pQctOI0D8LNnBZzhXfhJkoN5crA5EUEbJ0T1EFAbLQnuQrBX00Gfj08BJL')

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
    let storageData = user?.access_token || localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  const handleGetDetailsUser = async (id, token) => {
    try {
      let storageRefreshToken = localStorage.getItem('refresh_token')
      const refreshToken = JSON.parse(storageRefreshToken)
      const res = await UserService.getDetailsUser(id, token)
      dispatch(updateUser({ ...res?.data, access_token: token, refresh_token: refreshToken }))
    } catch (err) {
      console.error('Get user details error:', err)
    }
  }

  // 🧠 Tự động refresh token khi hết hạn
  useEffect(() => {
    const axiosJWT = UserService.axiosJWT

    axiosJWT.interceptors.request.use(
      async (config) => {
        const currentTime = new Date()
        const decoded = user?.access_token ? jwtDecode(user.access_token) : null

        if (decoded?.exp < currentTime.getTime() / 1000) {
          // Lấy refresh_token từ localStorage
          const storageRefreshToken = localStorage.getItem('refresh_token')
          if (!storageRefreshToken) {
            dispatch(resetUser())
            return Promise.reject('Missing refresh token')
          }

          const refreshToken = JSON.parse(storageRefreshToken)
          const decodedRefreshToken = jwtDecode(refreshToken)

          // Nếu refresh token vẫn còn hạn
          if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
            try {
              const data = await UserService.refreshToken(refreshToken)
              config.headers['token'] = `Bearer ${data?.access_token}`
              // ✅ Cập nhật redux + localStorage
              dispatch(updateUser({ access_token: data?.access_token }))
              localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            } catch (err) {
              dispatch(resetUser())
              return Promise.reject(err)
            }
          } else {
            // refresh token hết hạn
            dispatch(resetUser())
            return Promise.reject('Refresh token expired')
          }
        } else {
          // Token còn hạn
          config.headers['token'] = `Bearer ${user?.access_token}`
        }

        return config
      },
      (err) => Promise.reject(err)
    )
  }, [user?.access_token, dispatch])

  return (
    <Loading isLoading={isLoading}>
      <Elements stripe={stripePromise}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const isCheckAuth = !route.isPrivate || user.isAdmin

              if (!isCheckAuth) return null

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
        </Router>
      </Elements>
    </Loading>
  )
}

export default App
