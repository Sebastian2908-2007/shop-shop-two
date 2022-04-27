import React ,{ useEffect }from 'react';
import { useQuery } from '@apollo/client';
import { UPDATE_PRODUCTS } from '../../utils/actions';
// import our context hook that includes useContext
import { useStoreContext } from '../../utils/GlobalState';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';

function ProductList() {
  // use the useStoreContext function to get global state and dispatch function for changing data
  const [state, dispatch] = useStoreContext();
  // destructure currenCategory form the state variable retuned by useStoreContext
  const { currentCategory } = state;
  // query for our db data using the useQuery() hook from apollo/client
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // use the useEffect hook to update products array
  useEffect(() => {
    // useStoreContext will run again after updating the globalState it wil then give us the data neede to display products to the page
   if (data) {
     dispatch({
       type: UPDATE_PRODUCTS,
       products: data.products
     });
   }
  }, [data, dispatch]);



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
