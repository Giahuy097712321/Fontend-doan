// Xóa nhiều sản phẩm

import axios from "axios"
import { axiosJWT } from './UserService';

export const getAllProduct = async (search, limit) => {
    let url = `${process.env.REACT_APP_API_URL}/product/get-all`;

    // nếu có search
    if (search?.length > 0) {
        url += `?filter=name&filter=${search}`;
        if (limit) url += `&limit=${limit}`;
    }
    // nếu không có search
    else if (limit) {
        url += `?limit=${limit}`;
    }

    // Nếu không có limit => lấy tất cả sản phẩm
    const res = await axios.get(url);
    return res.data;
};
export const getProductType = async (type, page, limit) => {
    if (type) {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`);
        return res.data
    }
}
export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
    return res.data
}
export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-details/${id}`)
    return res.data
}
export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const deleteManyProduct = async (ids, access_token) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/product/delete-many`,
        { ids }, // 👈 bọc vào object
        {
            headers: { token: `Bearer ${access_token}` },
        }
    );
    return res.data;
};
export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`)
    return res.data
}