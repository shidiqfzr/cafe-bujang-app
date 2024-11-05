import React from 'react';
import './OrderDetailModal.css';

const OrderDetailModal = ({ order, onClose }) => {
  // Function to format the order date
  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('id-ID'); // Format date in Indonesian style
    } else {
      return 'Tanggal tidak valid'; // Fallback for invalid date
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Detail Pesanan</h3>
        <p><strong>Tanggal Pesanan:</strong> {formatOrderDate(order.date)}</p>
        <p><strong>Status:</strong> <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></p>
        
        <h4>Items:</h4>
        <ul className="item-list">
          {order.items.map((item, index) => (
            <li key={index} className="item">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity"> x {item.quantity}</span>
              <span className="item-price">@ {formatCurrency(item.price)}</span>
              <span className="item-total"> = {formatCurrency(item.quantity * item.price)}</span>
            </li>
          ))}
        </ul>
        
        <p className="total-price"><strong>Total Harga:</strong> {formatCurrency(order.amount)}</p>
        <button className="close-button" onClick={onClose}>Tutup</button>
      </div>
    </div>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export default OrderDetailModal;