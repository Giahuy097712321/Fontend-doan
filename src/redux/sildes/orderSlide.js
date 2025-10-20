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
        }
    },
})

// ✅ Export actions
export const { selectedOrder, addOrderProduct, removeOrderProduct, increaseAmount, decreaseAmount, removeAllOrderProduct } = orderSlide.actions

// ✅ Export reducer
export default orderSlide.reducer
