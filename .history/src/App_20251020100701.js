import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import jwtDecode from 'jwt-decode'
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, resetUser } from './redux/sildes/userSlide'
import Loading from './components/LoadingComponent/Loading'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe('pk_test_51SI7EV4jpDA4s9fLxgfls2fsOOxJTewAkZ6MnRE9pQctOI0D8LNnBZzhXfhJkoN5crA5EUEbJ0T1EFAbLQnuQrBX00Gfj08BJL')

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(true)

  // 🧠 Khi reload → tự refresh token bằng cookie
  useEffect(() => {
    const fetchUserWithRefresh = async () => {
      try {
        const res = await UserService.refreshToken()
        if (res?.access_token) {
          const decoded = jwtDecode(res.access_token)
          const userId = decoded?.id || decoded?._id
          if (userId) {
            const detail = await UserService.getDetailsUser(userId, res.access_token)
            dispatch(updateUser({ ...detail.data, access_token: res.access_token }))
          }
        } else {
          dispatch(resetUser())
        }
      } catch (err) {
        console.error('Refresh failed:', err)
        dispatch(resetUser())
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserWithRefresh()
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
