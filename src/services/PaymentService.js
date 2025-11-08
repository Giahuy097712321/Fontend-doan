// XÓA DÒNG IMPORT AXIOS KHÔNG SỬ DỤNG
// import axios from "axios"

import { axiosJWT } from "./UserService"

export const createPaymentIntent = async (totalPrice, token) => {
    console.log("💰 Gửi yêu cầu thanh toán Stripe với dữ liệu:", { totalPrice, token })
    try {
        const res = await axiosJWT.post(
            `${process.env.REACT_APP_API_URL}/payment/create-payment-intent`,
            { totalPrice }, // ✅ backend đang destructure { totalPrice }
            {
                headers: {
                    token: `Bearer ${token}`,
                },
            }
        )

        console.log("📥 Phản hồi từ server:", res.data)
        return res.data // ✅ Trả về đúng dữ liệu để frontend nhận
    } catch (error) {
        console.error("❌ Lỗi khi tạo PaymentIntent:", error.response?.data || error.message)
        throw error
    }
}