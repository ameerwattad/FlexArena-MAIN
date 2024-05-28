// Cart.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';

const Cart = ({ route }) => {
  const { product } = route.params;

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (product) {
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      if (existingItemIndex !== -1) {
        // If the product is already in the cart, update its quantity
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += product.quantity;
        setCartItems(updatedCart);
      } else {
        // If the product is not in the cart, add it
        setCartItems([...cartItems, product]);
      }
    }
  }, [product]);

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
  };

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {cartItems.map(item => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text>{item.name}</Text>
              <Text>Price: ${item.price.toFixed(2)}</Text>
              <View style={styles.quantityContainer}>
                <Text>Quantity:</Text>
                <TextInput
                  style={styles.quantityInput}
                  value={item.quantity.toString()}
                  onChangeText={text => updateQuantity(item.id, parseInt(text))}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.summary}>
        <Text>Total: ${calculateTotalPrice().toFixed(2)}</Text>
        {/* Proceed to checkout button */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
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
    color: 'red',
    marginTop: 5,
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
    alignItems: 'center',
  },
});

export default Cart;
