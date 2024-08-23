import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { database, auth } from './firebase'; // Import Firebase database reference
import { ref, onValue, off } from 'firebase/database';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // Function to fetch orders from Firebase
  const fetchOrders = () => {
    const userId = auth.currentUser?.uid; // Get the current user's ID
    if (userId) {
      const ordersRef = ref(database, `/orders/${userId}`);
      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ordersArray = Object.values(data);
          setOrders(ordersArray);
        } else {
          setOrders([]);
        }
      });
    }
  };

  useEffect(() => {
    fetchOrders();

    // Cleanup function to detach Firebase listener when component unmounts
    return () => {
      const userId = auth.currentUser?.uid; // Get the current user's ID
      if (userId) {
        const ordersRef = ref(database, `/orders/${userId}`);
        off(ordersRef, 'value');
      }
    };
  }, []);

  // Render function for each order item
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Address: {item.shippingInfo.address}</Text>
      <Text style={styles.orderText}>City: {item.shippingInfo.city}</Text>
      <Text style={styles.orderText}>Postal Code: {item.shippingInfo.postalCode}</Text>
      <Text style={styles.orderText}>Email: {item.shippingInfo.email}</Text>
      {/* You can add more order details here */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      {orders.length === 0 ? (
        <Text>No orders found</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  orderText: {
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
});
