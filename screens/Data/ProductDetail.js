import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating } from 'react-native-ratings';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [reviews, setReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    loadReviews();

    return () => unsubscribe();
  }, []);

  const addToCart = () => {
    if (!isLoggedIn) {
      Alert.alert('Error', 'You need to be logged in to add items to the cart.');
      return;
    }
    navigation.navigate('Cart', { product: { ...product, quantity } });
  };

  const loadReviews = async () => {
    try {
      const savedReviews = await AsyncStorage.getItem(`product_reviews_${product.id}`);
      if (savedReviews !== null) {
        setReviews(JSON.parse(savedReviews));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const saveReview = async (newReviews) => {
    try {
      await AsyncStorage.setItem(`product_reviews_${product.id}`, JSON.stringify(newReviews));
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  const handleSubmitReview = () => {
    if (comment.trim() !== '') {
      const newReview = {
        author: 'Your Name', // Change to user's name or remove this line if not needed
        comment: comment.trim(),
      };
      const newReviews = [...reviews, newReview];
      setReviews(newReviews);
      setComment('');
      saveReview(newReviews);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
    calculateTotalPrice(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      calculateTotalPrice(quantity - 1);
    }
  };

  const calculateTotalPrice = (quantity) => {
    const productPrice = parseFloat(product.price); // Convert price to a number
    if (product.discount) {
      const discountedPrice = productPrice * (1 - parseFloat(product.discount) / 100); // Convert discount to a number
      const newTotalPrice = discountedPrice * quantity;
      console.log('New total price:', newTotalPrice); // Log the new total price
      setTotalPrice(newTotalPrice); // Update totalPrice state variable
    } else {
      const newTotalPrice = productPrice * quantity;
      console.log('New total price:', newTotalPrice); // Log the new total price
      setTotalPrice(newTotalPrice); // Update totalPrice state variable
    }
  };
  

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={{ uri: product.image }} // Assuming product.image is a URI
          />
        </View>
        <View style={styles.productInfoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          <Text style={styles.productPrice}>{product.discount ? `Discounted Price: $${totalPrice}` : `Price: $${totalPrice}`}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
        {/* Additional code for reviews and related products if needed */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '80%',
    height: 200,
  },
  productInfoContainer: {},
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
  },
  quantity: {
    marginHorizontal: 20,
    fontSize: 18,
  },
  addToCartButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetail;
