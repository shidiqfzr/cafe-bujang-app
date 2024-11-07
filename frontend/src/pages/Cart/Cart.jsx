import React, { useContext, useState, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    handlePromoCode,
    discount,
    token,
    tableNumber,
  } = useContext(StoreContext);
  const [enteredPromoCode, setEnteredPromoCode] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    tableNumber: tableNumber,
    note: "",
    paymentMethod: "Electronic", // Default to electronic
  });
  const navigate = useNavigate();

  useEffect(() => {
    setCustomerInfo((prevInfo) => ({
      ...prevInfo,
      tableNumber: tableNumber, // Update the tableNumber if it changes in the context
    }));
  }, [tableNumber]);

  // Handle form input changes
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setCustomerInfo((info) => ({ ...info, [name]: value }));
  };

  // Place order function
  const placeOrder = async (event) => {
    event.preventDefault();

    // Create order items array
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      items: orderItems,
      discount: discount,
      amount: getTotalCartAmount() - discount,
      tableNumber: customerInfo.tableNumber,
      note: customerInfo.note,
      paymentMethod: customerInfo.paymentMethod,
    };

    try {
      if (customerInfo.paymentMethod === "Electronic") {
        // Electronic payment
        const response = await axios.post(url + "/api/order/place", orderData, {
          headers: { token },
        });

        if (response.data.success) {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else {
          alert("Error: " + response.data.message);
        }
      } else if (customerInfo.paymentMethod === "Manual") {
        // Manual payment
        const response = await axios.post(
          url + "/api/order/manual",
          orderData,
          {
            headers: { token },
          }
        );

        if (response.data.success) {
          alert("Order placed successfully for manual payment!");
          navigate("/order-confirmation"); // Redirect to a confirmation page if needed
        } else {
          alert("Error: " + response.data.message);
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order. Please try again.");
    }
  };

  // Redirect to cart if no items in cart or no token
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [getTotalCartAmount, navigate, token]);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Item</p>
          <p>Nama</p>
          <p>Harga</p>
          <p>Jumlah</p>
          <p>Total</p>
          <p>Hapus</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                  <p>{item.name}</p>
                  <p>{formatCurrency(item.price)}</p>
                  <p className="item-quantity">{cartItems[item._id]}</p>
                  <p>{formatCurrency(item.price * cartItems[item._id])}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-bottom-left">
          
          <div className="customer-info">
            <h2>Informasi Pelanggan</h2>
            <label htmlFor="tableNumber">Nomor Meja:</label>
            <input
              name="tableNumber"
              onChange={onChangeHandler}
              value={customerInfo.tableNumber}
              type="number"
              placeholder="Nomor Meja"
              required
            />
            <label htmlFor="tableNumber">Catatan Tambahan:</label>
            <input
              name="note"
              onChange={onChangeHandler}
              value={customerInfo.note}
              type="text"
              placeholder="Opsional"
            />
            <label htmlFor="tableNumber">Metode Pembayaran:</label>
            <select
              name="paymentMethod"
              value={customerInfo.paymentMethod}
              onChange={onChangeHandler}
            >
              <option value="Electronic">Pembayaran Elektronik</option>
              <option value="Manual">Pembayaran Manual</option>
            </select>
          </div>

          <div className="cart-promocode">
            <h2>Voucher</h2>
            <div>
              <p>Jika kamu memiliki kode promo, masukkan di sini</p>
              <div className="cart-promocode-input">
                <input
                  type="text"
                  placeholder="kode promo"
                  value={enteredPromoCode}
                  onChange={(e) => setEnteredPromoCode(e.target.value)}
                />
                <button onClick={() => handlePromoCode(enteredPromoCode)}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="cart-total">
          <h2>Total Keranjang</h2>
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
          <button onClick={placeOrder}>PROSES PESANAN</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
