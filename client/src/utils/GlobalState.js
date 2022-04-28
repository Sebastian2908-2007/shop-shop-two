// import create context from react this will allow us to create and use our global store
import React, { createContext, useContext } from "react";
// our reducer funtion from reducers.js
import { useProductReducer } from "./reducers";
//instantiate the global state object:
const StoreContext = createContext();
// destructure provider out of createContext
const { Provider } = StoreContext;

// custom provider function that will be used to manage and update our state using the reducer we created
// The value prop is good to have included, as it opens us up to pass in more data for state if we need to.
// prop, or rather ...props, is in place to handle any other props the user may need. Namely, we'll need to use props.children, as this <StoreProvider> component will wrap all of our other components, making them children of it.
// If we didn't include {...props} in our returning <Provider> component, nothing on the page would be rendered!
const StoreProvider = ({ value=[], ...props }) => {
    const [state, dispatch] = useProductReducer({
        products: [],
        cart: [],
        cartOpen: false,
        categories: [],
        currentCategory: '',
    });
  //  console.log(state);
    return <Provider value={[state, dispatch]} {...props} />
};

const useStoreContext = () => {
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };