import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Alert, FlatList, KeyboardAvoidingView } from 'react-native';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, database } from '../firebase'; // Import Firebase auth and database instances
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, child } from 'firebase/database';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [reviews, setReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    loadReviews();
    fetchRelatedProducts();

    calculateTotalPrice(1);

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
    if (comment.trim() !== '' && rating > 0) {
      const newReview = {
        author: 'Your Name', // Change to user's name or remove this line if not needed
        comment: comment.trim(),
        rating: rating,
      };
      const newReviews = [...reviews, newReview];
      setReviews(newReviews);
      setComment('');
      setRating(0); // Reset rating
      saveReview(newReviews);
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    calculateTotalPrice(newQuantity);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      calculateTotalPrice(newQuantity);
    }
  };

  const calculateTotalPrice = (quantity) => {
    const productPrice = parseFloat(product.price); // Convert price to a number
    let newTotalPrice = productPrice * quantity;
    if (product.discount) {
      const discountedPrice = productPrice * (1 - parseFloat(product.discount) / 100); // Convert discount to a number
      newTotalPrice = discountedPrice * quantity;
    }
    setTotalPrice(newTotalPrice.toFixed(2)); // Update totalPrice state variable
  };

  const fetchRelatedProducts = async () => {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'products'));
      if (snapshot.exists()) {
        const allProducts = snapshot.val();
        const filteredProducts = Object.values(allProducts).filter(
          (prod) => prod.category === product.category && prod.id !== product.id
        );
        const limitedRelatedProducts = filteredProducts.slice(0, 5);
        setRelatedProducts(limitedRelatedProducts);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewAuthor}>{item.author}</Text>
      <Rating
        imageSize={20}
        readonly
        startingValue={item.rating}
        style={styles.reviewRating}
      />
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  const renderRelatedProductItem = ({ item }) => (
    <TouchableOpacity style={styles.relatedProductItem} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
      <Image style={styles.relatedProductImage} source={{ uri: item.image }} />
      <Text style={styles.relatedProductName}>{item.name}</Text>
      <Text style={styles.relatedProductPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  const formatTitle = (title) => {
    const words = title.split(' ');
    const rows = [];
    for (let i = 0; i < words.length; i += 2) {
      rows.push(words.slice(i, i + 2).join(' '));
    }
    return rows.join('\n');
  };

  const renderHeader = () => (
    <>
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={{ uri: product.image }} // Assuming product.image is a URI
        />
      </View>
      <View style={styles.productInfoContainer}>
        <Text style={styles.productName}>{formatTitle(product.name)}</Text>
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
    </>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          <>
            <View style={styles.reviewFormContainer}>
              {isLoggedIn ? (
                <>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Write your review..."
                    value={comment}
                    onChangeText={setComment}
                  />
                  <Rating
                    showRating
                    onFinishRating={setRating}
                    style={styles.rating}
                  />
                  <TouchableOpacity style={styles.submitReviewButton} onPress={handleSubmitReview}>
                    <Text style={styles.submitReviewButtonText}>Submit Review</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.loginPromptContainer}>
                  <Text style={styles.loginPromptText}>You need to be logged in to submit a review.</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginButtonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.relatedProductsContainer}>
              <Text style={styles.relatedProductsTitle}>Related Products</Text>
              <FlatList
                horizontal
                data={relatedProducts}
                renderItem={renderRelatedProductItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.relatedProductsList}
              />
            </View>
          </>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background color
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff', // White background for image container
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: '80%',
    height: 200,
    borderRadius: 10, // Rounded corners for image
  },
  productInfoContainer: {
    paddingHorizontal: 20,
  },
  productName: {
    fontSize: 24, // Larger font size for product name
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40', // Dark text color
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: '#6c757d', // Secondary text color
  },
  productPrice: {
    fontSize: 20, // Larger font size for price
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#28a745', // Green color for price
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff', // Primary color for buttons
    borderRadius: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text color
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
  },
  addToCartButton: {
    backgroundColor: '#28a745', // Green color for add to cart button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addToCartButtonText: {
    color: '#fff', // White text color
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reviewFormContainer: {
    padding: 20,
  },
  commentInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  rating: {
    marginBottom: 10,
  },
  submitReviewButton: {
    backgroundColor: '#007bff', // Primary color for submit button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitReviewButtonText: {
    color: '#fff', // White text color
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    backgroundColor: '#fff', // White background for reviews
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 10,
    borderRadius: 5,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#343a40',
  },
  reviewRating: {
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  reviewComment: {
    fontSize: 14,
    color: '#6c757d',
  },
  relatedProductsContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa', // Light background for related products section
  },
  relatedProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  relatedProductsList: {
    flexDirection: 'row',
  },
  relatedProductItem: {
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#fff', // White background for related product items
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  relatedProductImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
    borderRadius: 10, // Rounded corners for images
  },
  relatedProductName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#343a40',
  },
  relatedProductPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  loginPromptContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loginPromptText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#6c757d',
  },
  loginButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default ProductDetail;
