import React from "react";
import "./../styles/CartItem.css";

const CartItem = ({ item, onQtyChange, onDelete }) => {
  const name = item?.name || "Unnamed Item";
  const price = item?.price ?? 0;
  const quantity = item?.quantity ?? 1;
  const image = item?.imgUrl?.[0] ;


  return (
    <div className="cart-item-container">
      <div className="cart-item-card">
        <img src={image} alt={name} className="cart-item-img" />
        <div className="cart-item-content">
          <h3>{name}</h3>
          <p className="cart-item-price">₹{price}</p>

          <div className="cart-item-actions">
            <div className="qty-controls">
              <button onClick={() => onQtyChange(item._id, quantity - 1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => onQtyChange(item._id, quantity + 1)}>+</button>
            </div>

            <button className="remove-btn" onClick={() => onDelete(item._id)}>Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
