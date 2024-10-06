import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
  }).format(amount);
};

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, handlePromoCode, discount } =
    useContext(StoreContext);
  const [enteredPromoCode, setEnteredPromoCode] = useState("");
  const navigate = useNavigate();

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
        })}
      </div>
      <div className="cart-bottom">
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
              <button onClick={() => handlePromoCode(enteredPromoCode)}>Submit</button>
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
          <button onClick={() => navigate("/order")}>
            PROSES PESANAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
