import axios from "axios";
import jwtDecode from "jwt-decode";

// ====================================
// ⚙️ Khởi tạo axios instance cho JWT
// ====================================
export const axiosJWT = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true, // gửi cookie refresh token
});

// ====================================
// 🧩 Các API chức năng người dùng
// ====================================

// Đăng nhập
export const loginUser = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/sign-in`,
        data,
        { withCredentials: true }
    );
    return res.data;
};

// Đăng ký
export const signupUser = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/sign-up`,
        data,
        { withCredentials: true }
    );
    return res.data;
};

// Lấy chi tiết user
export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`/user/get-details/${id}`, {
        headers: { token: `Bearer ${access_token}` },
    });
    return res.data; // ✅ chỉ trả về res.data, KHÔNG JSON.parse
};

// Làm mới access token
export const refreshToken = async () => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/refresh-token`,
        {},
        { withCredentials: true }
    );
    return res.data; // ✅ chỉ trả về object từ backend
};

// Đăng xuất
export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`, {}, { withCredentials: true });
    return res.data;
};

// Cập nhật user
export const updateUser = async (id, data, access_token) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/user/update-user/${id}`,
        data,
        {
            headers: { token: `Bearer ${access_token}` },
            withCredentials: true,
        }
    );
    return res.data;
};

// Xóa 1 user
export const deleteUser = async (id, access_token) => {
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_API_URL}/user/delete-user/${id}`,
        {
            headers: { token: `Bearer ${access_token}` },
        }
    );
    return res.data;
};

// Lấy tất cả user
export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(`/user/getAll`, {
        headers: { token: `Bearer ${access_token}` },
    });
    return res.data;
};

// Xóa nhiều user
export const deleteManyUser = async (ids, access_token) => {
    const res = await axiosJWT.post(
        `/user/delete-many`,
        { ids },
        { headers: { token: `Bearer ${access_token}` } }
    );
    return res.data;
};

// ====================================
// 🔄 Interceptor: tự refresh token khi hết hạn
// ====================================
axiosJWT.interceptors.request.use(
    async (config) => {
        try {
            let accessToken = localStorage.getItem("access_token");
            if (!accessToken) return config;

            // ⚠️ Không parse nếu không phải JSON
            try {
                accessToken = JSON.parse(accessToken);
            } catch {
                // Nếu token là string (đã lưu sẵn), giữ nguyên
            }

            const decoded = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                // Token hết hạn → gọi refresh
                const data = await refreshToken();
                accessToken = data?.access_token;

                if (accessToken) {
                    localStorage.setItem("access_token", JSON.stringify(accessToken));
                    config.headers["token"] = `Bearer ${accessToken}`;
                }
            } else {
                config.headers["token"] = `Bearer ${accessToken}`;
            }

            return config;
        } catch (error) {
            console.error("Interceptor error:", error);
            return config;
        }
    },
    (err) => Promise.reject(err)
);
