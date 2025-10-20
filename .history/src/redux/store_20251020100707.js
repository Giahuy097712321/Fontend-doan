import { configureStore, combineReducers } from '@reduxjs/toolkit'
import productReducer from './sildes/productSlide'
import userReducer from './sildes/userSlide'
import orderReducer from './sildes/orderSlide'
import storage from 'redux-persist/lib/storage'
import {
   persistStore,
   persistReducer,
   FLUSH,
   REHYDRATE,
   PAUSE,
   PERSIST,
   PURGE,
   REGISTER,
} from 'redux-persist'

// Cấu hình redux-persist
const persistConfig = {
   key: 'root',
   version: 1,
   storage,

   blacklist: ['product', 'user'], // Không lưu trữ state của productReducer
}

// Gộp tất cả reducers lại
const rootReducer = combineReducers({
   product: productReducer,
   user: userReducer,
   order: orderReducer,
})

// Bọc rootReducer bằng persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Cấu hình store chính
export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
         },
      }),
})

// Tạo persistor để duy trì state giữa các lần tải lại trang
export const persistor = persistStore(store)
