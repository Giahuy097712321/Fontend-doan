import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import jwtDecode from 'jwt-decode'
import ProtectedRoute from './routes/ProtectedRoute'
import * as UserService from '../src/services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/sildes/userSlide'
import Loading from './components/LoadingComponent/Loading'
import SocketStatus from './components/SocketStatus/SocketStatus'
import { SocketProvider } from './contexts/SocketContext'
import ChatComponent from './components/ChatComponent/ChatComponent'

// 🎯 Import Stripe
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// Import icon nếu có, hoặc dùng emoji
import './App.css' // Thêm CSS cho modal

// ⚙️ Khởi tạo Stripe Public Key
const stripePromise = loadStripe(
  'pk_test_51SI7EV4jpDA4s9fLxgfls2fsOOxJTewAkZ6MnRE9pQctOI0D8LNnBZzhXfhJkoN5crA5EUEbJ0T1EFAbLQnuQrBX00Gfj08BJL'
)

function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoNotice, setShowDemoNotice] = useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    // Kiểm tra xem đã hiển thị thông báo trong session này chưa
    const hasSeenNotice = sessionStorage.getItem('hasSeenDemoNotice')

    if (!hasSeenNotice) {
      // Hiển thị thông báo sau 1 giây để trang load xong
      const timer = setTimeout(() => {
        setShowDemoNotice(true)
      }, 1000)

      return () => clearTimeout(timer)
    }

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

  const handleCloseDemoNotice = async () => {
    setShowDemoNotice(false)
    // Lưu vào sessionStorage để không hiển thị lại trong session này
    sessionStorage.setItem('hasSeenDemoNotice', 'true')

    // Fetch user details immediately so we don't need a full page reload
    setIsLoading(true)
    try {
      const { storageData, decoded } = handleDecoded()
      if (decoded?.id && storageData) {
        await handleGetDetailsUser(decoded?.id, storageData)
      }
    } catch (err) {
      console.error('Error fetching user after closing demo notice', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Loading isLoading={isLoading}>
      {/* Modal thông báo trang web demo */}
      {showDemoNotice && (
        <div className="demo-notice-overlay">
          <div className="demo-notice-modal">
            {/* Header với gradient */}
            <div className="demo-notice-header">
              <div className="warning-icon">⚠️</div>
              <h2 className="demo-notice-title">THÔNG BÁO QUAN TRỌNG</h2>
            </div>

            {/* Content */}
            <div className="demo-notice-content">
              <div className="project-info">
                <h3>XÂY DỰNG WEBSITE BÁN HÀNG ĐIỆN TỬ GIA DỤNG</h3>
                <p className="subtitle">Khóa luận tốt nghiệp - Chuyên ngành Công nghệ thông tin</p>
              </div>

              <div className="notice-box">
                <p className="notice-text">
                  <strong>Đây chỉ là trang web DEMO</strong> phục vụ cho mục đích học tập và nghiên cứu.
                  Tất cả chức năng, sản phẩm và giao dịch trên website này đều là giả lập.
                </p>
              </div>

              <div className="warning-box">
                <p className="warning-text">
                  ⚠️ <strong>Lưu ý:</strong> Không sử dụng thông tin thật, thẻ tín dụng thật hoặc bất kỳ
                  phương thức thanh toán thật nào trên website này.
                </p>
              </div>

              <div className="tech-stack">
                <p>
                  <strong>Công nghệ sử dụng:</strong> ReactJS • NodeJS • MongoDB • Redux • Socket.io • Stripe (test)
                </p>
                <p className="copyright">
                  Website được xây dựng với mục đích học thuật - © {new Date().getFullYear()}
                </p>
              </div>
            </div>

            {/* Footer với button */}
            <div className="demo-notice-footer">
              <button
                className="understand-btn"
                onClick={handleCloseDemoNotice}
              >
                Tôi đã hiểu, tiếp tục vào website
              </button>
            </div>
          </div>
        </div>
      )}

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
            <SocketStatus />
          </Router>
        </SocketProvider>
      </Elements>
    </Loading>
  )
}

export default App