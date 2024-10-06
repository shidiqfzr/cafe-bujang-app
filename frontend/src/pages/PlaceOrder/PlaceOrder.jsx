import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
  }).format(amount);
};

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, discount } = useContext(StoreContext);

  const [data, setData] = useState({
    name: "",
    tableNumber: "",
    note: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = []
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo)
      }
    })

    let orderData = {
      // address: data,
      items: orderItems,
      amount: getTotalCartAmount() - discount,
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token }
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order. Please try again.");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    }
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [getTotalCartAmount, navigate, token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Informasi Pelanggan</p>
        <div className="multi-fields">
          <input
            name="name"
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            placeholder="Nama"
            required
          />
          <input
            name="tableNumber"
            onChange={onChangeHandler}
            value={data.tableNumber}
            type="number"
            placeholder="Nomor Meja"
            required
          />
          <input
            name="note"
            onChange={onChangeHandler}
            value={data.note}
            type="text"
            placeholder="Catatan Tambahan"
          />
        </div>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h1>Total Keranjang</h1>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{formatCurrency(getTotalCartAmount())}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Voucher Diskon</p>
              <p>- {formatCurrency(discount)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total Pembayaran</b>
              <b>{formatCurrency(getTotalCartAmount() - discount)}</b>
            </div>
          </div>
          <button type="submit">PROSES PEMBAYARAN</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
