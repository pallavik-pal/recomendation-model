import { Box, Grid, HStack, Link, Text } from "@chakra-ui/react";
import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      bg="#7f5539"
      color="white"
      width="1529px"
      py={10}
      px={100}
      bottom="0"
      left="0"
      right="0"
    >
      <Box maxW="100%" mx="auto" px={4}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
          {/* Need Help Section */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Need Help?
            </Text>
            <Text>Call Us: +91 98585893957</Text>
            <Text>
              Email Us:{" "}
              <Link href="mailto:QuickPick6@gmail.com" color="teal.300">
                QuickPick6@gmail.com
              </Link>
            </Text>
          </Box>

          {/* Follow Us Section */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Follow Us
            </Text>
            <HStack spacing={4}>
              <Link href="https://www.instagram.com" isExternal>
                <FaInstagram size={24} />
              </Link>
              <Link href="https://www.facebook.com" isExternal>
                <FaFacebookF size={24} />
              </Link>
              <Link href="https://wa.me/918317391142" isExternal>
                <FaWhatsapp size={24} />
              </Link>
            </HStack>
          </Box>

          {/* Company Section */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Company
            </Text>
            <Text>
              <Link href="#">About Us</Link>
            </Text>
            <Text>
              <Link href="#">Sell Products on QuickPick</Link>
            </Text>
            <Text>
              <Link href="#">Become an Affiliate</Link>
            </Text>
            <Text>
              <Link href="#">Contact Us</Link>
            </Text>
          </Box>

          {/* Policies Section */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Our Policies
            </Text>
            <Text>
              <Link href="#">Privacy Policy</Link>
            </Text>
            <Text>
              <Link href="#">Terms & Conditions</Link>
            </Text>
            <Text>
              <Link href="#">Refund & Return Policy</Link>
            </Text>
            <Text>
              <Link href="#">Support</Link>
            </Text>
          </Box>
        </Grid>
        <Box mt={8} textAlign="center">
          <Text fontSize="sm">
            &copy; 2024 E-commerce Site. All Rights Reserved.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
