import React ,{ useEffect }from 'react';
import { useQuery } from '@apollo/client';
import { UPDATE_PRODUCTS } from '../../utils/actions';
// import our context hook that includes useContext
import { useStoreContext } from '../../utils/GlobalState';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';
import { idbPromise } from '../../utils/helpers';

function ProductList() {
  // use the useStoreContext function to get global state and dispatch function for changing data
  const [state, dispatch] = useStoreContext();
  // destructure currenCategory form the state variable retuned by useStoreContext
  const { currentCategory } = state;
  // query for our db data using the useQuery() hook from apollo/client
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // use the useEffect hook to update products array
  useEffect(() => {
    // if data is there send it to global state
   if (data) {
     dispatch({
       type: UPDATE_PRODUCTS,
       products: data.products
     });
   // lets also take each product and save it to indexedDb using the helper function
   data.products.forEach((product) => {
     idbPromise('products','put', product);
   })
   // if loading value from useQuery is undefined get data from indexedDb and add it to the global store
  }else if (!loading) {
    // since were offline get all of the data from the products store
    idbPromise('products', 'get').then((products) => {
      // use retrieved data to set global state for offline browsing
      dispatch({
        type: UPDATE_PRODUCTS,
        products: products
      });
    })
  }
  }, [data, loading, dispatch]);



  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(
      product => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
