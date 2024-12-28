import { getShoppingCart } from "../utilities/fakedb";

const cartProductsLoader = async () => {
  const storedCart = getShoppingCart();
  const storedCartKeys = Object.keys(storedCart);

  const loadedProducts = await fetch(
    "https://ema-john-pagination-server-starter-pink.vercel.app/productsById",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(storedCartKeys),
    }
  );
  const products = await loadedProducts.json();

  // if cart data is in database, you have to use async await
  //   console.log(storedCart);

  const savedCart = [];

  for (const id in storedCart) {
    const addedProduct = products.find((pd) => pd._id === id);
    if (addedProduct) {
      const quantity = storedCart[id];

      addedProduct.quantity = quantity;

      savedCart.push(addedProduct);
    }
  }

  // if you need to send two things
  // return [products, savedCart]
  // another options
  // return { products, cart: savedCart }

  return savedCart;
};

export default cartProductsLoader;
