import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { CartContext } from "./CartContext";


const ProductDetails = () => {
  const { productId } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const products = location.state?.products || [];
  const toast = useToast();

  const product = products.find((p) => p._id === productId);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);

  const handleAddToCart = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo ? userInfo._id : null;

 const apiUrl = process.env.REACT_APP_API_URL;
    if (userId && product._id) {
      try {
        const response = await fetch(`${apiUrl}/api/user-interactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: product._id,
            action: "add_to_cart",
            ctr: 0,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(
            "Product added to cart and interaction saved:",
            data.message
          );
        } else {
          console.log("Error saving interaction:", data.error);
        }
      } catch (error) {
        console.error("Error saving interaction:", error);
      }
    } else {
      console.log("User not authenticated or product ID missing.");
    }

    addToCart(product);

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  };

  // Fetch recommended products based on the current product's category or user behavior
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userId = userInfo ? userInfo._id : null;
const apiUrl = process.env.REACT_APP_API_URL;
        if (userId) {
          const response = await fetch(`${apiUrl}/api/recommendations/${userId}`);
          const data = await response.json();
          setRecommendedProducts(data.recommendations || []);
        }
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };

    const fetchCategoryProducts = () => {
      // Find category-based products, excluding the current product
      const relatedProducts = products.filter(
        (p) => p.category === product.category && p._id !== productId
      );
      setCategoryProducts(relatedProducts);
    };

    fetchRecommendedProducts();
    fetchCategoryProducts();
  }, [productId, product?.category, products]);

  // State to manage image click effect
  const [isImageClicked, setIsImageClicked] = useState(false);

  if (!product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bg="white"
      >
        <Text fontSize="xl" color="black">
          Product not found!
        </Text>
      </Box>
    );
  }

  return (
    <Box
      p={10}
      bg="white"  //#e8e8e4
      color="black"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      width="100%"
    >
      {/* Image Modal when clicked */}
      {isImageClicked && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="#e8e8e4"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
          onClick={() => setIsImageClicked(false)}
        >
          <Image
            src={product.image}
            alt={product.name}
            Width="500px"
            Height="500px"
            objectFit="contain"
          />
        </Box>
      )}

      <Flex flexDirection="column" gap={6} flex="1" overflowY="auto">
        <Flex flexDirection="row" alignItems="center" width="100%">
          <Box
            border="2px solid"
            borderColor="gray.300"
            borderRadius="md"
            overflow="hidden"
            boxShadow={isImageClicked ? "lg" : "md"}
            transition="transform 0.2s, box-shadow 0.2s"
            transform={isImageClicked ? "translateY(-10px)" : "none"}
            onClick={() => setIsImageClicked(!isImageClicked)}
            cursor="pointer"
          >
            <Image
              src={product.image}
              alt={product.name}
              width="650px"
              height="450px"
              objectFit="cover"
            />
          </Box>
          <Box ml={6} width="100%">
            <Text fontSize="5xl" fontWeight="bold" mb={3}>
              {product.name}
            </Text>
            <Text fontSize="2xl" color="gray.800" mb={5}>
              {product.description}
            </Text>
            <Flex justifyContent="space-between" mb={5}>
              <Text fontSize="4xl" fontWeight="bold" color="gray.800">
                ${product.price}
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.600" mb={5}>
              *Price includes applicable tax.
            </Text>
            <Box mb={5}>
              <Text fontSize="lg" fontWeight="bold" mb={3}>
                EMI Options Available
              </Text>
              <FormControl>
                <FormLabel htmlFor="emi-options" fontSize="md">
                  Select EMI Plan
                </FormLabel>
                <Select
                  id="emi-options"
                  placeholder="Choose EMI option"
                  color="black"
                  bg="white"
                >
                  <option value="3-months">3 Months - 0% Interest</option>
                  <option value="6-months">6 Months - 0% Interest</option>
                  <option value="12-months">12 Months - 10% Interest</option>
                  <option value="18-months">18 Months - 15% Interest</option>
                </Select>
              </FormControl>
            </Box>

            {/* Add to Cart and Buy Now Buttons Below EMI */}
            <Box mb={5}>
              <Flex>
                <Button
                  colorScheme="teal"
                  flex="1"
                  mr={3}
                  mb={3}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button colorScheme="teal" flex="1" mb={3}>
                  Buy Now
                </Button>
              </Flex>
            </Box>
          </Box>
        </Flex>

        {/* Review Section */}
        <Divider my={6} borderColor="gray.600" />
        <VStack align="flex-start" spacing={4}>
          <Text fontSize="2xl" fontWeight="bold" backgroundColor={"black"} color={"white"}>
            Customer Reviews
          </Text>
          {/* Review content here... */}
        </VStack>

        {/* Review Submission */}
        <Divider my={6} borderColor="gray.600" />
        <Text fontSize="lg" fontWeight="bold"> 
          Leave a Review
        </Text>
        <FormControl id="review">
          <FormLabel>Your Review</FormLabel>
          <Textarea
            placeholder="Write your review here..."
            mb={3}
           backgroundColor={"black"} color={"white"}
          />
          <Button colorScheme="blue">Submit Review</Button>
        </FormControl>

        {/* Recommended Products Section */}
        <Divider my={1} borderColor="gray.600" />
        <Text fontSize="2xl" fontWeight="bold">
          Recommended Products
        </Text>
        <Flex wrap="wrap" justifyContent="space-between" gap={4}> 
          {recommendedProducts.map((recommendedProduct) => (
            <Box
              key={recommendedProduct._id}
              width="200px"
              padding={4}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              bg="black"
              boxShadow="md"
            >
              <Image
                src={recommendedProduct.image}
                alt={recommendedProduct.name}
                width="100%"
                height="150px"
                objectFit="cover"
              />
              <Text fontWeight="bold" mt={2}>
                {recommendedProduct.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                ${recommendedProduct.price}
              </Text>
              <Button
                colorScheme="teal"
                size="sm"
                mt={2}
                onClick={() =>
                  history.push(`/product/${recommendedProduct._id}`)
                }
              >
                View Details
              </Button>
            </Box>
          ))}
        </Flex>

        {/* Related Products (Category-Based) */}
        <Divider my={1} borderColor="gray.600" />

        <Flex wrap="wrap" justifyContent="space-between" gap={4}>
          {categoryProducts.map((relatedProduct) => (
            <Box
              key={relatedProduct._id}
              width="200px"
              padding={4}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              bg="white"
              boxShadow="md"
            >
              <Image
                src={relatedProduct.image}
                alt={relatedProduct.name}
                width="100%"
                height="150px"
                objectFit="cover"
              />
              <Text fontWeight="bold" mt={2}>
                {relatedProduct.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                ${relatedProduct.price}
              </Text>
              <Button
                colorScheme="teal"
                size="sm"
                mt={2}
                onClick={() => history.push(`/product/${relatedProduct._id}`)}
              >
                View Details
              </Button>
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ProductDetails;
