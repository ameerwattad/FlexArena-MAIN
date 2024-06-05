import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, ScrollView, Button, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProductsList from '../admin/ProdcutsList';
import { ref, onValue, push, remove } from 'firebase/database';
import { database } from './firebase';

const ProductsScreen = ({ products, onProductPress, onRemoveProduct }) => (
  <ScrollView contentContainerStyle={styles.content}>
    <ProductsList products={products} onProductPress={onProductPress} onRemoveProduct={onRemoveProduct} />
  </ScrollView>
);

const AddProductScreen = ({ newProduct, setNewProduct, handleAddProduct, ratingInputRef }) => (
  <ScrollView contentContainerStyle={styles.content}>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={newProduct.name}
        onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={newProduct.description}
        onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
        multiline={true}
        numberOfLines={10}
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
        value={newProduct.rating.toString()}
        onChangeText={(text) => setNewProduct({ ...newProduct, rating: parseFloat(text) || 0 })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={newProduct.image}
        onChangeText={(text) => setNewProduct({ ...newProduct, image: text })}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

const BugReportsScreen = ({ bugReports }) => (
  <ScrollView contentContainerStyle={styles.content}>
    <View style={styles.bugReportsContainer}>
      <Text style={styles.bugReportsTitle}>Bug Reports</Text>
      {bugReports.map((bugReport, index) => (
        <View key={index} style={styles.bugReportItem}>
          <Text style={styles.bugReportText}>{`Bug Description: ${bugReport.bugDescription}`}</Text>
          <Text style={styles.bugReportText}>{`Steps to Reproduce: ${bugReport.stepsToReproduce}`}</Text>
        </View>
      ))}
    </View>
  </ScrollView>
);

const ContactFormsScreen = ({ contactForms }) => (
  <ScrollView contentContainerStyle={styles.content}>
    <View style={styles.contactFormsContainer}>
      <Text style={styles.contactFormsTitle}>Contact Forms</Text>
      {contactForms.map((form, index) => (
        <View key={index} style={styles.contactFormItem}>
          <Text style={styles.contactFormText}>{`Name: ${form.name}`}</Text>
          <Text style={styles.contactFormText}>{`Email: ${form.email}`}</Text>
          <Text style={styles.contactFormText}>{`Message: ${form.message}`}</Text>
        </View>
      ))}
    </View>
  </ScrollView>
);

const Tab = createBottomTabNavigator();

const AdminDashboard = () => {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    image: '',
    rating: 0,
  });
  const [bugReports, setBugReports] = useState([]);
  const [contactForms, setContactForms] = useState([]);
  const ratingInputRef = useRef(null);

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

    const bugReportsRef = ref(database, 'bugReports');
    onValue(bugReportsRef, (snapshot) => {
      const data = snapshot.val();
      const reportsList = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      })) : [];
      setBugReports(reportsList);
    });

    const contactFormsRef = ref(database, 'contactForms');
    onValue(contactFormsRef, (snapshot) => {
      const data = snapshot.val();
      const formsList = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      })) : [];
      setContactForms(formsList);
    });
  }, []);

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.description || !newProduct.category || !newProduct.price) {
        throw new Error('All fields are required for the product');
      }

      const productsRef = ref(database, 'products');
      await push(productsRef, newProduct);
      setNewProduct({ name: '', description: '', category: '', price: '', discount: '', image: '', rating: 0 });
      dismissKeyboard();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const productRef = ref(database, `products/${productId}`);
      await remove(productRef);
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = () => {
    if (password === 'ameer') {
      setLoggedIn(true);
    } else {
      Alert.alert('Invalid password', 'Please enter the correct password.');
    }
  };

  return (
    <View style={styles.container}>
      {!loggedIn ? (
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Products') {
                iconName = focused ? 'cart' : 'cart-outline';
              } else if (route.name === 'Add Product') {
                iconName = focused ? 'add' : 'add-outline';
              } else if (route.name === 'Bug Reports') {
                iconName = focused ? 'bug' : 'bug-outline';
              } else if (route.name === 'Contact Forms') {
                iconName = focused ? 'mail' : 'mail-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarLabel: ({ focused, color }) => {
              let label;
              if (route.name === 'Products') {
                label = `Products (${products.length})`;
              } else if (route.name === 'Add Product') {
                label = 'Add Product';
              } else if (route.name === 'Bug Reports') {
                label = `Bug Reports (${bugReports.length})`;
              } else if (route.name === 'Contact Forms') {
                label = `Contact Forms (${contactForms.length})`;
              }
              return <Text style={{ color, fontSize: 12 }}>{label}</Text>;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Products">
            {() => <ProductsScreen products={products} onProductPress={setSelectedProduct} onRemoveProduct={handleRemoveProduct} />}
          </Tab.Screen>
          <Tab.Screen name="Add Product">
            {() => <AddProductScreen newProduct={newProduct} setNewProduct={setNewProduct} handleAddProduct={handleAddProduct} ratingInputRef={ratingInputRef} />}
          </Tab.Screen>
          <Tab.Screen name="Bug Reports">
            {() => <BugReportsScreen bugReports={bugReports} />}
          </Tab.Screen>
          <Tab.Screen name="Contact Forms">
            {() => <ContactFormsScreen contactForms={contactForms} />}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
  },
  content: {
    padding: 16,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bugReportsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  bugReportsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bugReportItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  bugReportText: {
    fontSize: 16,
    color: '#495057',
  },
  contactFormsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  contactFormsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactFormItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  contactFormText: {
    fontSize: 16,
    color: '#495057',
  },
});

export default AdminDashboard;
