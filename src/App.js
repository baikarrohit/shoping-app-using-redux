import { useDispatch, useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { Fragment, useEffect} from "react";
import { uiActions } from "./Store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true;
function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const notification = useSelector((state) => state.ui.notification);
  const cart = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  useEffect(() => {
    const sendCartData = async () => {
      try {
        dispatch(
          uiActions.showNotification({
            status: "pending",
            title: "Sending...",
            message: "Sending to cart!",
          })
        );
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
    if (isInitial) {
      isInitial = false;
      return;
    }
    sendCartData();
  }, [cart, dispatch]);
  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
