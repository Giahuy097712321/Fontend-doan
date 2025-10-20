import axios from "axios"
import jwtDecode from "jwt-decode"


export const axiosJWT = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true, // ✅ gửi cookie refresh token
})
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
    const res = await axiosJWT.get(`/user/get-details/${id}`, {
        headers: { token: `Bearer ${access_token}` },
    })
    return res
}

// Refresh token
export const refreshToken = async (refreshToken) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/refresh-token`,
        {},
        {
            withCredentials: true,
            headers: {
                token: `Bearer ${refreshToken}`,
            },
        }
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
