import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configureAxios from '../utils/configureAxios';

const categories = [
  "smartphones", "laptops", "fragrances", "skincare", "groceries", "home-decoration", "furniture",
  "tops", "womens-dresses", "womens-shoes", "mens-shirts", "mens-shoes", "mens-watches",
  "womens-watches", "womens-bags", "womens-jewellery", "sunglasses", "automotive", "motorcycle", "lighting",
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userEnteredPrice, setUserEnteredPrice] = useState('');

  useEffect(() => {
    // Configure Axios with the token
    configureAxios();

    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        const allProducts = response.data.products;

        // Filter by selected categories
        const filteredByCategory = selectedCategories.length
          ? allProducts.filter((product) => selectedCategories.includes(product.category))
          : allProducts;

        // Filter by user-entered price
        const filteredByPrice = userEnteredPrice
          ? filteredByCategory.filter((product) => product.price <= parseFloat(userEnteredPrice))
          : filteredByCategory;

        setProducts(filteredByPrice);
        setFilteredProducts(filteredByPrice);
        setMaxPrice(Math.max(...filteredByPrice.map((product) => product.price)));
      } catch (error) {
        console.error(error);
        // Handle error (e.g., display an error message to the user)
      }
    };

    fetchProducts();
  }, [selectedCategories, userEnteredPrice]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter((product) => product.title.toLowerCase().includes(query));
    setFilteredProducts(filtered);
  };

  const handleCategoryFilter = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handlePriceFilter = () => {
    // Update the products based on the user-entered price
    setFilteredProducts(products.filter((product) => product.price <= parseFloat(userEnteredPrice)));
  };

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);

    const newTotalAmount = updatedCart.reduce((total, item) => total + item.price, 0);
    setTotalAmount(newTotalAmount);
  };

  return (
    <div>
      <h1>Products</h1>

      <div>
        Cart Count: {cart.length} | Total Amount: {totalAmount.toFixed(2)}
      </div>

      <div>
        <label htmlFor="maxPrice">Max Price:</label>
        <input
          type="number"
          id="maxPrice"
          value={userEnteredPrice}
          onChange={(e) => setUserEnteredPrice(e.target.value)}
        />
        <button onClick={handlePriceFilter}>Apply Price Filter</button>
      </div>

      <div>
        <h2>Filter by Category</h2>
        {categories.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryFilter(category)}
            />
            {category}
          </label>
        ))}
      </div>

      <div>
        {filteredProducts.map((product) => (
          <div key={product.id}>
            <h3>{product.title}</h3>
            <p>Price: ${product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
