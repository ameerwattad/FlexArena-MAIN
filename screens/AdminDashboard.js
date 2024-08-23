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

// OrdersScreen Component
const OrdersScreen = ({ orders }) => {
  return (
    <View style={styles.ordersContainer}>
      <Text style={styles.ordersTitle}>Orders</Text>
      {orders && Object.keys(orders).length > 0 ? (
        Object.keys(orders).map((userId) => (
          Object.keys(orders[userId]).map((orderId) => (
            <View key={orderId} style={styles.orderItem}>
              <Text style={styles.orderText}>Order ID: {orderId}</Text>
              <Text style={styles.orderText}>Amount: {orders[userId][orderId]?.paymentIntent?.amount || 'N/A'}</Text>
              <Text style={styles.orderText}>Status: {orders[userId][orderId]?.paymentIntent?.status || 'N/A'}</Text>
              <Text style={styles.orderText}>Address: {orders[userId][orderId]?.shippingInfo?.address || 'N/A'}</Text>
              <Text style={styles.orderText}>City: {orders[userId][orderId]?.shippingInfo?.city || 'N/A'}</Text>
              <Text style={styles.orderText}>Email: {orders[userId][orderId]?.shippingInfo?.email || 'N/A'}</Text>
              <Text style={styles.orderText}>Postal Code: {orders[userId][orderId]?.shippingInfo?.postalCode || 'N/A'}</Text>
            </View>
          ))
        ))
      ) : (
        <Text>No orders available</Text>
      )}
    </View>
  );
};



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
  const [orders, setOrders] = useState([]);
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

    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const ordersList = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      })) : [];
      setOrders(ordersList);
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

              } else if (route.name === 'Orders') {
                iconName = focused ? 'clipboard' : 'clipboard-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Products">
            {() => (
              <ProductsScreen
                products={products}
                onProductPress={setSelectedProduct}
                onRemoveProduct={handleRemoveProduct}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Add Product">
            {() => (
              <AddProductScreen
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                handleAddProduct={handleAddProduct}
                ratingInputRef={ratingInputRef}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Bug Reports">
            {() => <BugReportsScreen bugReports={bugReports} />}
          </Tab.Screen>
          <Tab.Screen name="Contact Forms">
            {() => <ContactFormsScreen contactForms={contactForms} />}
          </Tab.Screen>
          <Tab.Screen name="Orders">
            {() => <OrdersScreen orders={orders} />}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  descriptionInput: {
    height: 100,
  },
  saveButton: {
    backgroundColor: 'tomato',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  bugReportsContainer: {
    marginBottom: 20,
  },
  bugReportsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bugReportItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  bugReportText: {
    fontSize: 16,
  },
  contactFormsContainer: {
    marginBottom: 20,
  },
  contactFormsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactFormItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  contactFormText: {
    fontSize: 16,
  },
  ordersContainer: {
    marginBottom: 20,
  },
  ordersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminDashboard;
