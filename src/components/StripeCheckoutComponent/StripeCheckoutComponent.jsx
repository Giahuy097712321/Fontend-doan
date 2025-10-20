// src/components/StripeCheckoutComponent/StripeCheckoutComponent.jsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, message } from 'antd';
import * as PaymentService from '../../services/PaymentService';

const StripeCheckoutComponent = ({ totalPrice, clientSecret, user, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        const cardElement = elements.getElement(CardElement);

        try {
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: user?.name,
                        email: user?.email,
                        phone: user?.phone,
                    },
                },
            });

            if (error) {
                message.error(error.message || 'Thanh toán thất bại!');
                setLoading(false);
            } else if (paymentIntent?.status === 'succeeded') {
                // Gọi callback frontend để payOrder
                await onSuccess();
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi xử lý thanh toán!');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement options={{ hidePostalCode: true, style: { base: { fontSize: '16px' } } }} />
            <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ marginTop: '20px', width: '100%' }}
            >
                Thanh toán {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
            </Button>
        </form>
    );
};

export default StripeCheckoutComponent;
