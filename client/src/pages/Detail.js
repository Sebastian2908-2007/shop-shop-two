import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../utils/GlobalState';

import { 
  UPDATE_PRODUCTS, 
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
} from '../utils/actions';

import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';
import Cart from '../components/Cart';
import { idbPromise } from '../utils/helpers';

function Detail() {
  // bring in function that holds useContext
  const [state,dispatch] = useStoreContext();
  // this comes from react-router-dom and will allow us to use the id we have put in url
  const { id } = useParams();
  // initialize state to an empty object
  const [currentProduct, setCurrentProduct] = useState({});
  // query the graphql db to get all product info
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  // destructure "products" from our global state
  const { products, cart } = state;

  // this use effect will run anytime the dependencies change it is initialized by the changing
  // of the data dependency in this case which will initially be undefined untill the query completes
  useEffect(() => {
    // if there is products set current product to equal the product with the id we got from useParams()
    if (products.length) {
     setCurrentProduct( products.find((product) => product._id === id)
     )
    
    }else if (data) {
      // if there is data update our globalStore products array
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      data.products.forEach((product) => {
        idbPromise('products','put', product);
      });
    }
    else if (!loading) {
      idbPromise('products','get').then((indexedProducts) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts
        });
      });
    }
    // dependency array
  }, [products, data, dispatch, id]);

  // ADD TO CART FUNCTION
  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if(itemInCart) { 
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });  
      // if were updating quantity use existing item data and increment purchaseQuantity value by one
      idbPromise('cart','put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    }else{ 
    dispatch({
      type: ADD_TO_CART,
      product: { ...currentProduct, purchaseQuantity: 1 }
    });
    // if product is not on the cart yet, add it to the current shopping cart in IndexedDB
    idbPromise('cart','put', {...currentProduct, purchaseQuantity: 1});
  }
  };

  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id
    });

    // upon removal from cart , delete the item from indexedDB using the `currentProduct._id` to locate what to remove
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  // use the data in the currentProduct variable set by our use state functions setter setCurrentProduct();
  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            
            <button
            disabled={!cart.find(p => p._id === currentProduct._id)}
            onClick={removeFromCart}
            >
              Remove from Cart
              
              </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
