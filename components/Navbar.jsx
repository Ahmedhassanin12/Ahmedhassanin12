import React from 'react'
import {AiOutlineShopping} from 'react-icons/ai'
import { useStateContext } from '../context/StateContext'
import Cart from './Cart'
 import Link from 'next/link'
const Navbar = () => {
  
 const {showCart, setShowCart, totalQuantities} =  useStateContext()

  return (
    <div className='navbar-container'>
       <p className='logo'>
         <Link href='/'>
          AHMED STORE
          </Link>
       </p>

       <button type='button' className='cart-icon' onClick={()=> setShowCart((prev)=> !prev)}>
          <AiOutlineShopping />
          <span className='cart-item-qty'>{totalQuantities}</span>
       </button>

      {showCart &&  <Cart />}
    </div>
  )
}

export default Navbar