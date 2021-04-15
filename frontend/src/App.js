import "./App.css";
import Footer from "./components/footer/Footer";
import Navigation from "./components/navigation/Navigation";
import Routes from "./components/Routes";
import io from "socket.io-client";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { updateSocket } from "./store/actions/socket";
import useHttpClient from "./hooks/useHttpClient";
import { fetchProducts } from "./store/actions/product";

let socket;
const ENDPOINT = "http://localhost:5000";

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    history.push("/urunler");
  }, []);

  socket = io.connect(ENDPOINT);

  dispatch(updateSocket(socket));

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5000/api/products"
        );
        dispatch(fetchProducts(response.products));
      } catch (error) {}
    };
    getProducts();
  }, []);

  return (
    <>
      <Navigation />
      <Routes />
      <Footer />
    </>
  );
}

export default App;
