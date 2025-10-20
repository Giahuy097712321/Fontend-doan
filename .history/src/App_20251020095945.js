import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, resetUser } from './redux/slides/userSlide'
import * as UserService from './services/UserService'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import Loading from './components/LoadingComponent/Loading'
import { routes } from './routes'

const stripePromise = loadStripe('pk_test_51SI7EV4jpDA4s9fLxgfls2fsOOxJTewAkZ6MnRE9pQctOI0D8LNnBZzhXfhJkoN5crA5EUEbJ0T1EFAbLQnuQrBX00Gfj08BJL')

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)

  // 🧠 Khi App khởi chạy → gọi refreshToken để lấy token mới nếu cookie hợp lệ
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        setIsLoading(true)
        const res = await UserService.refreshToken()
        if (res?.access_token) {
          dispatch(
            updateUser({
              access_token: res.access_token,
              refresh_token: res.refresh_token,
              name: res?.user?.name,
              email: res?.user?.email,
              id: res?.user?._id,
              isAdmin: res?.user?.isAdmin,
            })
          )
        } else {
          dispatch(resetUser())
        }
      } catch (error) {
        console.log('⚠️ Refresh token error:', error)
        dispatch(resetUser())
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccessToken()
  }, [dispatch])

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
