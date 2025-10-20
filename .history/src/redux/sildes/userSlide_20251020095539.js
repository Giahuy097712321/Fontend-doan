import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  access_token: '',
  refresh_token: '', // ✅ thêm refresh_token
  id: '',
  isAdmin: false,
  city: '',
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const payload = action.payload || {}
      const {
        name = '',
        email = '',
        access_token = state.access_token, // ✅ giữ token cũ nếu không có
        refresh_token = state.refresh_token,
        // ✅ giữ refresh_token cũ nếu không có
        address = '',
        phone = '',
        avatar = '',
        _id,
        id,
        isAdmin = state.isAdmin,
        city = ''
      } = payload

      // ✅ Ghi đè thông tin mới
      state.name = name
      state.email = email
      state.address = address
      state.phone = phone
      state.avatar = avatar
      state.id = _id || id || state.id // chấp nhận cả _id hoặc id
      state.access_token = access_token
      state.refresh_token = refresh_token// ✅ cập nhật refresh_token
      state.isAdmin = isAdmin
      state.city = city
    },

    resetUser: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const { updateUser, resetUser } = userSlide.actions
export default userSlide.reducer
