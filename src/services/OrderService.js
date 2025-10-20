import { axiosJWT } from "./UserService";

// 🧾 Tạo đơn hàng
export const createOrder = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
        headers: { token: `Bearer ${access_token}` },
    });
    return res.data;
};

// 🧍 Lấy đơn hàng theo userId
export const getOrderbyUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
        headers: { token: `Bearer ${access_token}` },
    });
    return res.data;
};

// 🧾 Lấy chi tiết đơn hàng
export const getDetailsOrder = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`, {
        headers: { token: `Bearer ${access_token}` },
    });
    return res.data;
};

// ❌ Hủy đơn hàng
export const cancelOrder = async (id, access_token, orderItems) => {
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`,
        {
            data: { orderItems },
            headers: { token: `Bearer ${access_token}` },
        }
    );
    return res.data;
};

// 💳 Thanh toán đơn hàng
export const payOrder = async (id, access_token) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/order/${id}/pay`,
        {},
        { headers: { token: `Bearer ${access_token}` } }
    );
    return res.data;
};

// 🧑‍💼 Lấy tất cả đơn hàng (admin)
export const getAllOrder = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
        headers: { token: `Bearer ${access_token}` },
    });
    return res.data;
};

// ✏️ Cập nhật đơn hàng
export const updateOrder = async (id, data, access_token) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/order/update/${id}`,
        data,
        { headers: { token: `Bearer ${access_token}` } }
    );
    return res.data;
};
