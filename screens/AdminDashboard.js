import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Modal, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import ProductsList from '../admin/ProdcutsList'; // Adjust the import path based on your project structure
import { ref, onValue, push, remove } from 'firebase/database';
import { database } from './firebase'; // Adjust the import path based on your project structure

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    image: '',
    rating: 0, // Add rating field with initial value 0
  });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const ratingInputRef = useRef(null); // Reference for the rating input field

  useEffect(() => {
    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const productList = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      })) : [];
      setProducts(productList);
    });
  }, []);

  // Function to handle product press
  const handleProductPress = (product) => {
    setSelectedProduct(product);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Function to handle adding a new product
  const handleAddProduct = async () => {
    try {
      // Check if all required fields are filled
      if (!newProduct.name || !newProduct.description || !newProduct.category || !newProduct.price) {
        throw new Error('All fields are required for the product');
      }

      const productsRef = ref(database, 'products');
      await push(productsRef, newProduct);
      setNewProduct({ name: '', description: '', category: '', price: '', discount: '', image: '', rating: 0 }); // Reset the rating
      setShowAddProduct(false); // Close the add product section after adding
      dismissKeyboard(); // Dismiss the keyboard
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Function to handle removing a product
  const handleRemoveProduct = async (productId) => {
    try {
      const productRef = ref(database, `products/${productId}`);
      await remove(productRef);
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  // Function to dismiss the keyboard
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <TouchableOpacity onPress={() => setShowAddProduct(!showAddProduct)} style={styles.addButton}>
        <Text style={styles.buttonText}>Add a Product</Text>
      </TouchableOpacity>

      {showAddProduct && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newProduct.name}
            onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newProduct.description}
            onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={newProduct.category}
            onChangeText={(text) => setNewProduct({ ...newProduct, category: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={newProduct.price}
            onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Discount"
            value={newProduct.discount}
            onChangeText={(text) => setNewProduct({ ...newProduct, discount: text })}
            keyboardType="numeric"
          />
          <TextInput
            ref={ratingInputRef}
            style={styles.input}
            placeholder="Rating"
            value={newProduct.rating.toString()} // Convert rating to string for TextInput
            onChangeText={(text) => setNewProduct({ ...newProduct, rating: parseFloat(text) || 0 })} // Parse input to float, default to 0 if invalid
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={newProduct.image}
            onChangeText={(text) => setNewProduct({ ...newProduct, image: text })}
          />
          <Button title="Save" onPress={handleAddProduct} />
        </View>
      )}

      {/* Render ProductsList component */}
      <ProductsList products={products} onProductPress={handleProductPress} onRemoveProduct={handleRemoveProduct} />

      {/* Modal to display product details */}
      <Modal visible={!!selectedProduct} onRequestClose={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Product Details</Text>
          {selectedProduct && (
            <View>
              <Text>Name: {selectedProduct.name}</Text>
              <Text>Description: {selectedProduct.description}</Text>
              <Text>Category: {selectedProduct.category}</Text>
              <Text>Price: ${selectedProduct.price}</Text>
              <Text>Rating: {selectedProduct.rating}</Text>
              <Button title="Close" onPress={closeModal} />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingLeft: 8,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'blue', // Adjust color as needed
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10, // Adjust margin as needed
    alignSelf: 'center', // Centers the button horizontally
  },
  buttonText: {
    color: 'white', // Adjust color as needed
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
