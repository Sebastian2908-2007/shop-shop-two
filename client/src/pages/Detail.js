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
  const { products } = state;

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
    }
    // dependency array
  }, [products, data, dispatch, id]);

  // ADD TO CART FUNCTION
  const addToCart = () => {
    dispatch({
      type: ADD_TO_CART,
      product: { ...currentProduct, purchaseQuantity: 1 }
    });
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
            <button>Remove from Cart</button>
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
