import axios from "axios"
import jwtDecode from "jwt-decode"


export const axiosJWT = axios.create()

// Login
export const loginUser = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/sign-in`,
        data,
        { withCredentials: true }
    )
    return res.data
}

// Signup
export const signupUser = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/sign-up`,
        data,
        { withCredentials: true }
    )
    return res.data
}

// Lấy chi tiết user
export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/user/get-details/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
            withCredentials: true
        }
    )
    return res.data
}

// Refresh token
export const refreshToken = async () => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/refresh-token`,
        {},
        { withCredentials: true }
    )
    return res.data
}
export const logoutUser = async () => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/log-out`)
    return res.data
}
export const updateUser = async (id, data, access_token) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/user/update-user/${id}`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
            withCredentials: true
        }
    );
    return res.data;
}
export const deleteUser = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/user/delete-user/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/getAll`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const deleteManyUser = async (ids, access_token) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/user/delete-many`,
        { ids },   // body gửi lên server
        {
            headers: { token: `Bearer ${access_token}` }, // config
        }
    );
    return res.data;
};

// Đổi mật khẩu
export const changePassword = async (id, data, access_token) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/user/change-password/${id}`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
            withCredentials: true
        }
    );
    return res.data;
};

// Quên mật khẩu - gửi OTP
// Quên mật khẩu - gửi OTP
export const forgotPassword = async (email) => {
    console.log('🔄 [Frontend] Gọi forgotPassword với email:', email);
    console.log('🔗 URL:', `${process.env.REACT_APP_API_URL}/user/forgot-password`);

    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/user/forgot-password`,
            { email }
        );
        console.log('✅ [Frontend] Response:', res.data);
        return res.data;
    } catch (error) {
        console.error('❌ [Frontend] Lỗi:', error.response?.data || error.message);
        console.error('❌ [Frontend] Status:', error.response?.status);
        throw error;
    }
};

// Reset mật khẩu với OTP
export const resetPassword = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/reset-password`,
        data
    );
    return res.data;
};

// Address management
export const getAddresses = async (id, access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/user/${id}/addresses`,
        {
            headers: { token: `Bearer ${access_token}` },
            withCredentials: true
        }
    )
    return res.data
}

export const addAddress = async (id, data, access_token) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/user/${id}/addresses`,
        data,
        {
            headers: { token: `Bearer ${access_token}` },
            withCredentials: true
        }
    )
    return res.data
}

export const updateAddress = async (id, addressId, data, access_token) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/user/${id}/addresses/${addressId}`,
        data,
        {
            headers: { token: `Bearer ${access_token}` },
            withCredentials: true
        }
    )
    return res.data
}

export const deleteAddress = async (id, addressId, access_token) => {
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_API_URL}/user/${id}/addresses/${addressId}`,
        {
            headers: { token: `Bearer ${access_token}` },
            withCredentials: true
        }
    )
    return res.data
}

export const setDefaultAddress = async (id, addressId, access_token) => {
    const res = await axiosJWT.patch(
        `${process.env.REACT_APP_API_URL}/user/${id}/addresses/${addressId}/default`,
        {},
        {
            headers: { token: `Bearer ${access_token}` },
            withCredentials: true
        }
    )
    return res.data
}

// ========================
// Interceptor cho axiosJWT
// ========================
axiosJWT.interceptors.request.use(
    async (config) => {
        let accessToken = localStorage.getItem("access_token")
        let decoded = {}

        if (accessToken) {
            accessToken = JSON.parse(accessToken)
            decoded = jwtDecode(accessToken)

            const currentTime = Date.now() / 1000
            if (decoded.exp < currentTime) {
                // gọi refresh token
                const data = await refreshToken()
                accessToken = data?.access_token

                localStorage.setItem("access_token", JSON.stringify(accessToken))
                config.headers["token"] = `Bearer ${accessToken}`
            } else {
                config.headers["token"] = `Bearer ${accessToken}`
            }
        }

        return config
    },
    (err) => Promise.reject(err)
)
