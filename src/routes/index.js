import HomePage from '../pages/HomePage/HomePage'
import OrderPage from '../pages/OrderPage/OrderPage'
import ProductPage from '../pages/ProductsPage/ProductPage'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import TypeProductPage from './../pages/TypeProductPage/TypeProductPage';
import SignInPage from './../pages/SignInPage/SignInPage';
import SignUpPage from './../pages/SignUpPage/SignUpPage';
import ProductDetailsPage from './../pages/ProductDetailsPage/ProductDetailsPage';
import ProfilePage from './../pages/Profile/ProfilePage';
import AdminPage from './../pages/AdminPage/AdminPage';
import PaymentPage from './../pages/PaymentPage/PaymentPage';
import OrderSuccess from './../pages/OrderSuccess/OrderSuccess';
import MyOrderPage from './../pages/MyOrderPage/MyOrderPage';
import DetailOrderPage from './../pages/DetailsOrderPage/DetailOrderPage';
import ForgotPasswordPage from './../pages/ForgotPasswordPage/ForgotPasswordPage';
export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/details-order/:id',
        page: DetailOrderPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/ordersuccess',
        page: OrderSuccess,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
        isShowFooter: true
    },

    // 🧊 Route trang tất cả sản phẩm (trước)
    {
        path: '/product',
        page: ProductPage,
        isShowHeader: true,
        isShowFooter: true
    },

    // 🏷️ Route loại sản phẩm cụ thể (sau)
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
        isShowFooter: true
    },

    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/forgot-password', // THÊM ROUTE MỚI
        page: ForgotPasswordPage,
        isShowHeader: false
    },
    {
        path: '/product-details/:id',
        page: ProductDetailsPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },

    // ⚠️ Route NotFoundPage nên để cuối cùng
    {
        path: '*',
        page: NotFoundPage
    }
]
