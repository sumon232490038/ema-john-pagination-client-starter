import React, { useEffect, useState } from "react";
import { addToDb, deleteShoppingCart } from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";

const Shop = () => {
  const cartData = useLoaderData();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(cartData);
  // const { count } = useLoaderData();
  const [count, setCount] = useState(0);
  // const count = 76;
  console.log(cartData);
  //   console.log(count);
  const [itemsPerPage, setitemsPerPage] = useState(10);
  const [currentPageNow, setCurrentPageNow] = useState(0);

  const totalPage = Math.ceil(count / itemsPerPage);

  const pages = [...Array(totalPage).keys()];
  useEffect(() => {
    fetch("http://localhost:5000/productsCounts")
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5000/products?page=${currentPageNow}&size=${itemsPerPage}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPageNow, itemsPerPage]);

  // useEffect(() => {
  //   const storedCart = getShoppingCart();
  //   const savedCart = [];
  //   // step 1: get id of the addedProduct
  //   for (const id in storedCart) {
  //     // step 2: get product from products state by using id
  //     const addedProduct = products.find((product) => product._id === id);
  //     if (addedProduct) {
  //       // step 3: add quantity
  //       const quantity = storedCart[id];
  //       addedProduct.quantity = quantity;
  //       // step 4: add the added product to the saved cart
  //       savedCart.push(addedProduct);
  //     }
  //     // console.log('added Product', addedProduct)
  //   }
  //   // step 5: set the cart
  //   setCart(savedCart);
  // }, [products]);

  const handlePages = (e) => {
    console.log(e.target.value);
    const val = parseInt(e.target.value);
    setitemsPerPage(val);
    setCurrentPageNow(0);
  };
  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handleNextPage = () => {
    if (currentPageNow < pages.length - 1) {
      setCurrentPageNow(currentPageNow + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPageNow > 0) {
      setCurrentPageNow(currentPageNow - 1);
    }
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="pagination">
        <h2>currentPage: {currentPageNow}</h2>
        <button onClick={handlePrevPage}>Prev</button>

        {pages.map((page) => (
          <button
            className={currentPageNow === page ? "btnColor" : ""}
            onClick={() => setCurrentPageNow(page)}
            key={page}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNextPage}>Next</button>
        <select onChange={handlePages} value={itemsPerPage} name="select" id="">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
