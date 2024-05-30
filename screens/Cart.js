// Import necessary modules
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, Pressable, Animated, Easing } from 'react-native';

// Define the Cart component
const Cart = ({ route }) => {
  const { product } = route.params || {};

  // Define state variables
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [animation] = useState(new Animated.Value(1)); // Initial value set to 1 (fully visible)

  // Function to animate quantity update
  const animateQuantityUpdate = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      animation.setValue(1); // Reset animation value to 1 (fully visible)
    });
  };

  // Function to add or update item in cart
  useEffect(() => {
    if (product && product.id) {
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      if (existingItemIndex !== -1) {
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += product.quantity;
        setCartItems(updatedCart);
      } else {
        setCartItems([...cartItems, product]);
      }
    }
  }, [product]);

  // Function to remove item from cart
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
  };

  // Function to update item quantity in cart
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      const updatedCart = cartItems.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedCart);
      animateQuantityUpdate(); // Trigger animation
    } else {
      // Handle case where quantity is 0 or less
      // You can show an error message or perform any other action here
    }
  };

  // Function to calculate total price of items in cart
  useEffect(() => {
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    setTotalPrice(total);
  }, [cartItems]);

  // Function to handle checkout
  const onCheckout = async () => {
    // Implement checkout logic
  };

  // Return JSX
  return (
    <View style={styles.container}>
      <ScrollView>
        {cartItems.map(item => (
          <Animated.View key={item.id} style={[styles.cartItem, { opacity: animation }]}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>Price: ${item.price}</Text>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <TextInput
                  style={styles.quantityInput}
                  value={item.quantity.toString()}
                  onChangeText={text => {
                    const parsedQuantity = parseInt(text);
                    if (!isNaN(parsedQuantity)) {
                      updateQuantity(item.id, parsedQuantity);
                    } else {
                      // Handle case where input is not a number
                      // You can show an error message or perform any other action here
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
        <Text style={styles.totalText}>Total: ${totalPrice}</Text>
        <Pressable onPress={onCheckout} style={styles.button}>
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
  itemPrice: {
    fontSize: 14,
    marginBottom: 5,
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
  button: {
    backgroundColor: '#6200EE',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// Export the Cart component
export default Cart;
