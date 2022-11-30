import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BsBagCheckFill } from "react-icons/bs";
import { useStateContext } from "../context/StateContext";
import { fireWrok } from "../lib/utlites";

const Success = () => {
  const { setTotalPrice, setCartItems, setTotalQuantities } = useStateContext();

  useEffect(() => {
    localStorage.clear();
    setTotalPrice(0);
    setCartItems([]);
    setTotalQuantities(0);
    fireWrok()
  }, []);
  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order</h2>
        <p className="email-msg">check your email inbox for the receipt</p>
        <p className="description">
          If you have any questions please contact us at{" "}
          <a href="mailto:ahmedhassanin1891@gmail.com">
            ahmedhassanin1891@gmail.com
          </a>
        </p>
        <Link href='/'>
            <button type="button" className="btn" width="280px">
                Continue Shopping
            </button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
