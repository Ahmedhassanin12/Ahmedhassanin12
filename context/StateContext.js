import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function setLocalStorage(key, value) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.log(e);
  }
}

function getLocalStorage(key, initialValue) {
  try {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem(key);

      return value ? JSON.parse(value) : initialValue;
    }
  } catch (e) {
    // if error, return initial value
    return initialValue;
  }
}

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState(() =>
    getLocalStorage("CART_ITEMS", [])
  );
  const [totalPrice, setTotalPrice] = useState(() =>
    getLocalStorage("TOTAL_PRICE", 0)
  );
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);
  // helper varibles
  let foundProduct;
  let index;

  // Local Storage: setting & getting data
  const itemsQty = () => {
    let qty = getLocalStorage("QUANTITY", 0);
    if (qty) {
      setTotalQuantities(qty);
    }
  };
  useEffect(() => {
    itemsQty();
  }, []);

  useEffect(() => {
    setLocalStorage("CART_ITEMS", cartItems);
    setLocalStorage("TOTAL_PRICE", totalPrice);
    setLocalStorage("QUANTITY", totalQuantities);
  }, [cartItems, totalPrice, totalQuantities]);

  // add to cart
  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item?._id === product?._id
    );

    setTotalPrice((prevPrice) => prevPrice + product.price * quantity);
    setTotalQuantities((prevQuntatitas) => prevQuntatitas + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct?._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quntaty + quantity,
          };
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${qty} ${product.name} added to the cart`);
  };
  // remove product from cart
  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setLocalStorage("TOTAL_PRICE", totalPrice);
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setLocalStorage("QUANTITY", totalQuantities);

    setCartItems(newCartItems);
  };
  // toggle Cart Item Quanitity
  const toggleCartItemQuanitity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);
    const newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === "inc") {
      setCartItems([
        ...newCartItems,
        { ...foundProduct, quantity: foundProduct.quantity + 1 },
      ]);

      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      // update total price in localStorage
      setLocalStorage("TOTAL_PRICE", totalPrice);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
      // update total quantity in localStorage
      setLocalStorage("QUANTITY", totalQuantities);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        setCartItems([
          ...newCartItems,
          { ...foundProduct, quantity: foundProduct.quantity - 1 },
        ]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };
  // incress quntatity
  const incressQty = () => {
    setQty((prevQty) => prevQty + 1);
  };
  // decress quntatity
  const decressQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incressQty,
        decressQty,
        onAdd,
        toggleCartItemQuanitity,
        onRemove,
        setTotalPrice,
        setCartItems,

        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
