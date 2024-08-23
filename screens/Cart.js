import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, Pressable, Animated, Easing, Alert } from 'react-native';
import { auth, database } from './firebase'; // Adjust the path to your firebase.js file
import { ref, set, onValue, off } from 'firebase/database';
import DarkMode from './settings/DarkMode'; // Import the DarkMode context
import Checkout from './Checkout'; // Import the Checkout component

const Cart = ({ route, navigation }) => {
  const { product } = route.params || {};
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [animation] = useState(new Animated.Value(1));
  const { isDarkMode } = useContext(DarkMode); // Access the isDarkMode state from the DarkMode context

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (userId) {
      const cartRef = ref(database, `/carts/${userId}`);
      onValue(cartRef, (snapshot) => {
        const cartData = snapshot.val() || [];
        setCartItems(cartData);
      });

      return () => {
        off(cartRef);
      };
    }
  }, [userId]);

  const saveCartToFirebase = (updatedCart) => {
    if (userId) {
      const cartRef = ref(database, `/carts/${userId}`);
      set(cartRef, updatedCart);
    }
  };

  useEffect(() => {
    if (product && product.id && userId) {
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      let updatedCart = [];
      if (existingItemIndex !== -1) {
        updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += product.quantity;
      } else {
        updatedCart = [...cartItems, product];
      }
      setCartItems(updatedCart);
      saveCartToFirebase(updatedCart);
    } else if (product && product.id && !userId) {
      Alert.alert('Please log in to add items to the cart.');
      navigation.navigate('Login'); // Adjust the route name as needed
    }
  }, [product]);

  const removeItem = (itemId) => {
    if (userId) {
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      saveCartToFirebase(updatedCart);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (userId) {
      if (newQuantity > 0) {
        const updatedCart = cartItems.map(item => {
          if (item.id === itemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        setCartItems(updatedCart);
        saveCartToFirebase(updatedCart);
        animateQuantityUpdate();
      }
    }
  };

  useEffect(() => {
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    setTotalPrice(total);
  }, [cartItems]);

  const onCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Your cart is empty', 'Please add items to the cart before checking out.');
    } else {
      navigation.navigate('Checkout', { totalAmount: totalPrice }); // Pass totalPrice to Checkout component
    }
  };

  const animateQuantityUpdate = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start();
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView>
        {cartItems.map(item => (
          <Animated.View key={item.id} style={[styles.cartItem, isDarkMode && styles.darkCartItem, { opacity: animation }]}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={[styles.itemName, isDarkMode && styles.darkItemName]}>{item.name}</Text>
              <Text style={[styles.itemPrice, isDarkMode && styles.darkItemPrice]}>Price: ${item.price}</Text>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <TextInput
                  style={styles.quantityInput}
                  value={item.quantity.toString()}
                  onChangeText={text => {
                    const parsedQuantity = parseInt(text);
                    if (!isNaN(parsedQuantity)) {
                      updateQuantity(item.id, parsedQuantity);
                    }
                  }}
                  keyboardType="numeric"
                  selectTextOnFocus={true}
                />
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
      <View style={styles.summary}>
        <Text style={[styles.totalText, isDarkMode && styles.darkTotalText]}>Total: ${totalPrice}</Text>
        <Pressable
          onPress={onCheckout}
          style={[styles.button, isDarkMode && styles.darkButton, cartItems.length === 0 && styles.disabledButton]}
          disabled={cartItems.length === 0}
        >
          <Text style={styles.buttonText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#333333',
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  darkCartItem: {
    backgroundColor: '#444444',
  },
  itemImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  itemDetails: {
    flex: 1,
    paddingVertical: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  darkItemName: {
    color: '#ffffff', // Adjust text color for dark mode
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 5,
  },
  darkItemPrice: {
    color: '#cccccc', // Adjust text color for dark mode
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityLabel: {
    marginRight: 5,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
    width: 50,
  },
  removeButton: {
    marginTop: 5,
  },
  removeButtonText: {
    color: '#FF3D00',
    fontSize: 14,
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -1,
    },
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkTotalText: {
    color: '#000000', // Adjust text color for dark mode
  },
  button: {
    backgroundColor: '#6200EE',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  darkButton: {
    backgroundColor: '#BB86FC', // Adjust background color for dark mode
  },
  disabledButton: {
    backgroundColor: '#cccccc', // Greyed out button for disabled state
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Cart;
