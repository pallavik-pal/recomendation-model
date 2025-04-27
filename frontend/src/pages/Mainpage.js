import {
  Avatar,
  Box,
  Grid,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import data from "./data.json";
import Footer from "./Footer";

const Mainpage = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]); // State to store fetched products
  const [lastSearchProducts, setLastSearchProducts] = useState([]); // Store the last successful search results
  const [relatedProducts, setRelatedProducts] = useState([]); // Store related products (e.g., vegetables)
  const [searchInitiated, setSearchInitiated] = useState(false); // Track if search is submitted
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // To manage the current image
  const images = ["/1.png", "/4.png", "/2.png", "/3.png"];

  // Fetch products from the backend
    const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiurl}/api/products`);
        const data = await response.json();
        setProducts(data); // Set the products in the state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  // Handle search text change
  const handleSearchTextChange = (e) => {
    const query = e.target.value;
    setSearchText(query);

    if (query) {
      // Ensure each item in data.queries is a string before calling .toLowerCase()
      const matchedSuggestions = data.queries.filter(
        (item) =>
          typeof item === "string" &&
          item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(matchedSuggestions); // Display matching suggestions
    } else {
      setSuggestions([]); // Clear suggestions if search text is empty
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      setSearchInitiated(true);
      setSuggestions([]); 

      // Save search history to MongoDB
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo ? userInfo._id : null; 

      if (userId && searchText.trim()) {
        try {
          const response = await fetch(`${apiurl}/api/search-history`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              search_query: searchText,
            }),
          });

          const data = await response.json();
          if (response.ok) {
            console.log("Search history saved:", data.message);
          } else {
            console.log("Error saving search history:", data.error);
          }
        } catch (error) {
          console.error("Error saving search history:", error);
        }
      }

      const searchQuery = searchText.toLowerCase();

      const keywords = searchQuery.split(" ").map((word) => word.trim());

   
      const directlyMatched = products.filter((product) => {
        const productName = product.name ? product.name.toLowerCase() : "";
        const productDescription = product.description
          ? product.description.toLowerCase()
          : "";

    
        return keywords.every(
          (keyword) =>
            productName.includes(keyword) ||
            productDescription.includes(keyword)
        );
      });

      const matchedCategories = [
        ...new Set(directlyMatched.map((product) => product.category)),
      ];

     
      const keywordBasedProducts = products.filter(
        (product) =>
          !directlyMatched.includes(product) && 
          product.category &&
          matchedCategories.includes(product.category)
      );

      // Update state
      setLastSearchProducts(directlyMatched); // Save the directly matched products
      setRelatedProducts(keywordBasedProducts); // Save only the related products for display purposes
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchText(suggestion); // Set search text to selected suggestion
    setSuggestions([]); // Clear suggestions after selection
  };

  // Handle product click
  const handleProductClick = async (productId) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo ? userInfo._id : null; // Fetch the user ID from localStorage

    if (userId) {
      try {
        const response = await fetch(`${apiurl}/api/user-interactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: productId,
            action: "click", // Action type is "click"
            ctr: 1, // Assume 100% click-through rate on click
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("User interaction saved:", data.message);
        } else {
          console.log("Error saving user interaction:", data.error);
        }
      } catch (error) {
        console.error("Error saving user interaction:", error);
      }
    }
  };

  // Determine which products to display
  const productsToDisplay = searchInitiated ? lastSearchProducts : [];

  return (
    <Box>
      {/* Navbar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#e6ccb2"
        w="100%"
        height="90px"
        p="5px 20px"
        borderWidth="5px"
        position="fixed"
        top="0"
        left="0"
        zIndex="1000"
      >
        {/* Logo */}
        <Text color="black" fontSize="2xl" fontWeight="bold">
          QuickPick
        </Text>

        {/* Search Bar */}
        <InputGroup maxW="1200px" w="80%">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="black" />
          </InputLeftElement>
          <Input
            value={searchText}
            onChange={handleSearchTextChange}
            onKeyDown={handleKeyDown} 
            placeholder="Search for items, users, etc."
            bg="transparent"
            color="black"
            borderColor="gray.300"
            focusBorderColor="black.500"
            _placeholder={{ color: "gray.400" }}
          />
          {suggestions.length > 0 && (
            <Box
              position="absolute"
              top="100%"
              left="0"
              right="0"
              bg="rgba(255, 255, 255, 0.7)"
              borderRadius="md"
              boxShadow="md"
              zIndex="999"
              p={4}
              mt={2}
              maxHeight="200px"
              overflowY="auto"
            >
              {suggestions.map((suggestion, index) => (
                <Box key={index}>
                  <Text
                    color="black"
                    cursor="pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Text>
                  {index < suggestions.length - 1 && (
                    <Box borderBottom="1px solid gray" my={2} />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </InputGroup>

        {/* Cart and Logout */}
        <HStack spacing={4}>
          <IconButton
            aria-label="Add to Cart"
            icon={<FaShoppingCart />}
            colorScheme="gray"
            size="lg"
            mr="20px"
            onClick={() => history.push("/Cart")}
          />
          <Menu>
            <MenuButton>
              <Avatar
                size="md"
                name="User Name"
                src="https://bit.ly/dan-abramov"
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => history.push("/profile")}>
                My Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("userInfo");
                  history.push("/"); // Redirect to login page after logout
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      {/* Products Section Below Navbar */}
      <Box
        mt="80px"
        pt="120px"
        p={120}
        minH="650px"
        width="100%" // Make the box take full width
        backgroundImage={`url(${images[currentImageIndex]})`}
        backgroundSize="100% 100%"
      >
        {searchInitiated && productsToDisplay.length === 0 ? (
          <Text textAlign="center" mt={10} fontSize="xl" color="gray.600">
            No products found. Please try again.
          </Text>
        ) : (
          <>
            {productsToDisplay.length > 0 && (
              <>
                {/* Direct Match Products */}
                <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                  {productsToDisplay.map((product) => (
                    <Link
                      key={product._id}
                      to={{
                        pathname: `/product/${product._id}`,
                        state: { products: products }, // Pass products through state
                      }}
                      onClick={() => handleProductClick(product._id)} // Track product click
                    >
                      <Box
                        borderWidth="1px"
                        borderRadius="md"
                        p={5}
                        backgroundColor="whitesmoke"
                        height="auto"
                        width="300px"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        overflow="hidden"
                        cursor="pointer"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          objectFit="cover"
                          width="250px"
                          height="180px"
                        />
                        <Text
                          mt={3}
                          fontSize="lg"
                          fontWeight="bold"
                          noOfLines={1}
                        >
                          {product.name}
                        </Text>
                        <Text
                          mt={2}
                          textAlign="center"
                          noOfLines={3}
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {product.description}
                        </Text>
                        <Text mt={3} color="blue.500">
                          ${product.price}
                        </Text>
                      </Box>
                    </Link>
                  ))}
                </Grid>
                {/* Recommendations */}
                <Text
                  textAlign="center"
                  fontSize="2xl"
                  mt={10}
                  fontWeight="bold"
                  backgroundColor="white"
                  color="black"
                  md="700px"
                >
                  Recommendations for You
                </Text>
                <Box height="50px" />
              </>
            )}
            {/* Category-based Products */}
            {relatedProducts.length > 0 && (
              <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                {relatedProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={{
                      pathname: `/product/${product._id}`,
                      state: { products: products },
                    }}
                    onClick={() => handleProductClick(product._id)}
                  >
                    <Box
                      borderWidth="1px"
                      borderRadius="md"
                      p={5}
                      backgroundColor="whitesmoke"
                      height="auto"
                      width="300px"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      overflow="hidden"
                      cursor="pointer"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        objectFit="cover"
                        width="250px"
                        height="180px"
                      />
                      <Text
                        mt={3}
                        fontSize="lg"
                        fontWeight="bold"
                        noOfLines={1}
                      >
                        {product.name}
                      </Text>
                      <Text
                        mt={2}
                        textAlign="center"
                        noOfLines={3}
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {product.description}
                      </Text>
                      <Text mt={3} color="blue.500">
                        ${product.price}
                      </Text>
                    </Box>
                  </Link>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>

      <Footer />
    </Box>
  );
};

export default Mainpage;
