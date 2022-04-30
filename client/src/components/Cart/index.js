import React, { useEffect } from 'react';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
// import useStoreContext to have access to the use context and use reducer functions
import { useStoreContext } from '../../utils/GlobalState';
// import our toggle cart action
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';


const Cart = () => {
  const [state,dispatch] = useStoreContext();

  // function to check if there's anything in the state's cart property on load. If not, we'll retrieve data from the IndexedDB cart object store. 
  useEffect(() => {
      async function getCart() {
          const cart = await idbPromise('cart','get');
          dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
      };

      if(!state.cart.length) {
          getCart();
      }
  }, [state.cart.length, dispatch]);

  // toggle cart functionality
  function toggleCart() {
      dispatch({type: TOGGLE_CART});
  };

  function calculateTotal() {
      let sum = 0;
      state.cart.forEach(item => {
          sum += item.price * item.purchaseQuantity;
      });
     
      
     
      // toFixed will set the number of digits to appear after decimal point
      return sum.toFixed(2);
      
  };

  // display cart or cart symbol depending on cartOpen Property
  if (!state.cartOpen) {
      return (
          <div className='cart-closed' onClick={toggleCart}>
              <span
              role="img"
              aria-label="trash">🛒</span>
          </div>
      );
  }




    return ( 
        <div className='cart'>
            <div className='close' onClick={toggleCart}>[close]</div>
            <h2>Shopping Cart</h2>
            {state.cart.length ? (
            <div>
              {state.cart.map(item => ( 
                  <CartItem key={item._id} item={item} />
            ))}

                <div className='flex-row space-between'>
                    <strong>Total: ${isNaN(calculateTotal()) ? '0': calculateTotal()}</strong>
                    {
                        Auth.loggedIn() ? 
                        <button>
                        Checkout
                        </button>
                        :
                        <span>(log in to check out)</span>
                    }
                </div>
            </div>
                ):(
                    <h3>
                        <span role="img" aria-label="shocked">
                        😱   
                        </span>
                        you havent added anything to your cart yet!
                    </h3>

                )}
        </div>
    );
};

export default Cart;