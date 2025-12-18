import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    orderItemsSelected: [],
    shippingAddress: {},
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload
            const itemOrder = state.orderItems.find(
                (item) => item.product === orderItem.product
            )
            if (itemOrder) {
                itemOrder.amount += orderItem.amount
            } else {
                state.orderItems.push(orderItem)
            }
        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const orderItemsSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
            if (itemOrder) {
                itemOrder.amount++
            }
            if (orderItemsSelected) {
                orderItemsSelected.amount++
            }
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const orderItemsSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
            if (itemOrder && itemOrder.amount > 1) {
                itemOrder.amount--
            }
            if (orderItemsSelected && orderItemsSelected.amount > 1) {
                orderItemsSelected.amount--
            }
        },
        removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems.filter(
                (item) => item.product !== idProduct
            )
            const orderItemsSelected = state?.orderItemsSelected.filter(
                (item) => item.product !== idProduct
            )
            state.orderItems = itemOrder
            state.orderItemsSelected = orderItemsSelected
        },
        removeAllOrderProduct: (state, action) => {
            const { listChecked } = action.payload
            const orderItems = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
            const orderItemsSelected = state?.orderItemsSelected?.filter((item) => !listChecked.includes(item.product))
            state.orderItems = orderItems
            state.orderItemsSelected = orderItemsSelected
        },
        selectedOrder: (state, action) => {
            const { listChecked } = action.payload || [];
            const orderSelected = [];
            state.orderItems?.forEach((order) => {
                if (listChecked.map(String).includes(String(order.product))) {
                    orderSelected.push(order);
                }
            });
            state.orderItemsSelected = orderSelected;
        },
        // ✅ SỬA LẠI ACTION syncCartWithProducts - CHỈ MUTATE DRAFT
        syncCartWithProducts: (state, action) => {
            const { existingProductIds } = action.payload;

            // Lọc ra sản phẩm không còn tồn tại
            const validOrderItems = state.orderItems.filter(item =>
                existingProductIds.includes(item.product)
            );

            const validOrderItemsSelected = state.orderItemsSelected.filter(item =>
                existingProductIds.includes(item.product)
            );

            // CHỈ MUTATE DRAFT, KHÔNG RETURN
            state.orderItems = validOrderItems;
            state.orderItemsSelected = validOrderItemsSelected;
        },
        // ✅ SỬA LẠI ACTION updateCartProducts - CHỈ MUTATE DRAFT
        updateCartProducts: (state, action) => {
            const { updatedProducts } = action.payload;

            // Cập nhật orderItems
            state.orderItems = state.orderItems.map(item => {
                const updatedProduct = updatedProducts.find(p => p._id === item.product);
                if (updatedProduct) {
                    return {
                        ...item,
                        name: updatedProduct.name,
                        price: updatedProduct.price,
                        image: updatedProduct.image,
                        discount: updatedProduct.discount || 0,
                        countInStock: updatedProduct.countInStock
                    };
                }
                return item;
            });

            // Cập nhật orderItemsSelected
            state.orderItemsSelected = state.orderItemsSelected.map(item => {
                const updatedProduct = updatedProducts.find(p => p._id === item.product);
                if (updatedProduct) {
                    return {
                        ...item,
                        name: updatedProduct.name,
                        price: updatedProduct.price,
                        image: updatedProduct.image,
                        discount: updatedProduct.discount || 0,
                        countInStock: updatedProduct.countInStock
                    };
                }
                return item;
            });
        },
        // ✅ SỬA LẠI ACTION handleProductDeletion - CHỈ MUTATE DRAFT
        handleProductDeletion: (state, action) => {
            const { deletedProductIds } = action.payload;

            // Xóa sản phẩm khỏi giỏ hàng
            state.orderItems = state.orderItems.filter(item =>
                !deletedProductIds.includes(item.product)
            );

            state.orderItemsSelected = state.orderItemsSelected.filter(item =>
                !deletedProductIds.includes(item.product)
            );
        },
        // ✅ SỬA LẠI ACTION resetOrder - RETURN GIÁ TRỊ MỚI
        resetOrder: () => {
            return initialState;
        }
    },
})

// ✅ Export tất cả actions
export const {
    selectedOrder,
    addOrderProduct,
    removeOrderProduct,
    increaseAmount,
    decreaseAmount,
    removeAllOrderProduct,
    syncCartWithProducts,
    updateCartProducts,
    handleProductDeletion,
    resetOrder
} = orderSlide.actions

// ✅ Export reducer
export default orderSlide.reducer