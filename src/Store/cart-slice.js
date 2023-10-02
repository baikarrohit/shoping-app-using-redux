import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], totalQuantity: 0 },
  reducers: {
    onRefresh(state, action) {
      state.totalQuantity = action.payload.totalQuantity;
      state.items = action.payload.items;
    },

    addItemToCart(state, action) {
      state.totalQuantity++;
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },

    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        state.totalQuantity--;

        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
        }
      }
    },
  },
});

export const fetchCartData = () => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "Fetching",
        title: "Fetching...",
        message: "Fetching data from cart.",
      })
    );
    const fetchData = async () => {
      const res = await fetch(
        "https://expense-tracker-project-a61f6-default-rtdb.firebaseio.com/cart.json"
      );
      if (!res.ok) {
        throw new Error("Could not fetch cart data.");
      }
      const data = await res.json();
      return data;
    };
    try {
      const cartData = await fetchData();
      dispatch(cartActions.onRefresh(cartData));
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Successfully fetched from cart.",
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending to cart failed.",
        })
      );
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending to cart!",
      })
    );
    const sendRequest = async () => {
      const res = await fetch(
        "https://expense-tracker-project-a61f6-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );
      if (!res.ok) {
        throw new Error("Unable to add");
      }
    };
    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Successfully sent to cart!",
        })
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending to cart failed.",
        })
      );
    }
  };
};

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
