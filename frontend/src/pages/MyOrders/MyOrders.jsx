import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
  };

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    // Fetch user orders
    const fetchOrders = async () => {
        try {
            const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Delete order
    const handleDelete = async (orderId) => {
        try {
            await axios.delete(`${url}/api/order/delete/${orderId}`, { headers: { token } });
            // Remove the deleted order from state
            setData(data.filter(order => order._id !== orderId));
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>Riwayat Pemesanan</h2>
            <div className='container'>
                {data.length === 0 ? (
                    <div className='no-orders'>
                        <img src={assets.empty_cart} alt="No orders" />
                        <p>Kamu belum memiliki riwayat pemesanan. Yuk, buat pesanan sekarang!</p>
                    </div>
                ) : (
                    data.map((order, index) => (
                        <div key={index} className='my-orders-order'>
                            <img src={assets.order_icon} alt="" />
                            <p>{order.items.map((item, idx) => 
                                idx === order.items.length - 1 
                                    ? `${item.name} x ${item.quantity}` 
                                    : `${item.name} x ${item.quantity}, `
                            )}</p>
                            <p>{formatCurrency(order.amount)}</p>
                            <p>Items: {order.items.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                            <button onClick={() => handleDelete(order._id)}>Hapus</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyOrders;