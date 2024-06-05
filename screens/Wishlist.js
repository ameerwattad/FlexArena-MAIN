import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { database, auth } from './firebase'; // Import Firebase database and auth instances
import { ref, get, onValue } from 'firebase/database';

export default function Wishlist({ navigation }) {
  const [wishlistProducts, setWishlistProducts] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const wishlistRef = ref(database, `wishlist/${user.uid}`);
    onValue(wishlistRef, (snapshot) => {
      if (snapshot.exists()) {
        const wishlistData = snapshot.val();
        const wishlistArray = Object.values(wishlistData);
        setWishlistProducts(wishlistArray);
      } else {
        setWishlistProducts([]); // No wishlist items found
      }
    });

    return () => {
      // Cleanup function
      // Remove any listeners or subscriptions
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Wishlist</Text>
      <View style={styles.productsContainer}>
        {wishlistProducts.map((product, index) => (
          <TouchableOpacity key={index} style={styles.product} onPress={() => navigation.navigate('ProductDetail', { product: product })}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description.slice(0, 30)}...</Text>
              <Text style={styles.productRating}>Rating: {product.rating}</Text>
              <Text style={styles.productPrice}>Price: ${product.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa', // Light background color
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40', // Dark text color
    textAlign: 'center',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  product: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: '#fff', // White background for product
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10, // Rounded corners for product image
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center', // Center product details vertically
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#343a40', // Dark text color
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 5,
    color: '#6c757d', // Secondary text color
  },
  productRating: {
    fontSize: 14,
    marginBottom: 5,
    color: '#6c757d', // Secondary text color
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745', // Green color for price
  },
});
