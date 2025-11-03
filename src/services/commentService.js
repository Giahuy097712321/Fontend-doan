// src/services/commentService.js
import axios from "axios"
import { axiosJWT } from "./UserService"

// Thêm bình luận mới
export const addComment = async (productId, data, access_token) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/comment/create/${productId}`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
            withCredentials: true
        }
    )
    return res.data
}

// Lấy tất cả bình luận của sản phẩm
export const getComments = async (productId, params = {}) => {
    const { page = 1, limit = 10, sort = 'newest' } = params

    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/comment/get-all/${productId}`,
        {
            params: { page, limit, sort },
            withCredentials: true
        }
    )
    return res.data
}

// Cập nhật bình luận
export const updateComment = async (productId, commentId, data, access_token) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/comment/update/${productId}/${commentId}`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
            withCredentials: true
        }
    )
    return res.data
}

// Xóa bình luận
export const deleteComment = async (productId, commentId, access_token) => {
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_API_URL}/comment/delete/${productId}/${commentId}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
            withCredentials: true
        }
    )
    return res.data
}

// Like/Unlike comment
export const toggleLikeComment = async (productId, commentId, access_token) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/comment/like/${productId}/${commentId}`,
        {},
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
            withCredentials: true
        }
    )
    return res.data
}

// Lấy thống kê rating
export const getRatingStats = async (productId) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/comment/rating-stats/${productId}`,
        { withCredentials: true }
    )
    return res.data
}

// Lấy tất cả bình luận (cho admin)
export const getAllComments = async (access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/comment/admin/get-all`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
            withCredentials: true
        }
    )
    return res.data
}

// Xóa nhiều bình luận (cho admin)
export const deleteManyComments = async (ids, access_token) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/comment/admin/delete-many`,
        { ids },
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
            withCredentials: true
        }
    )
    return res.data
}