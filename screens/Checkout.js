import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { auth, database } from './firebase'; 
import { ref, push, set } from 'firebase/database';

const API_URL = "http://172.20.10.2:3000";

const Checkout = ({ route }) => {

  const { totalAmount = 0 } = route.params;

  const [shippingInfo, setShippingInfo] = useState({
    email: '',
    fullName:'',
    address: '',
    city: '',
    postalCode: '',
  });
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalAmount * 100 }), 
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Server Error:', text);
        throw new Error(`Server error: ${response.status}`);
      }

      const { clientSecret, error } = await response.json();
      return { clientSecret, error };
    } catch (error) {
      console.error('Fetch Payment Intent Error:', error);
      return { error: error.message };
    }
  };

  const handlePayPress = async () => {
    if (!cardDetails?.complete || !shippingInfo.email) {
      Alert.alert("Please enter complete card details and shippinh details");
      return;
    }

    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.fullName) {
      Alert.alert("Please enter complete shipping information");
      return;
    }

    const billingDetails = {
      email: shippingInfo.email,
      fullName: shippingInfo.fullName,
      address: {
        line1: shippingInfo.address,
        city: shippingInfo.city,
        postal_code: shippingInfo.postalCode,
      },
    };

    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();

      if (error) {
        console.log("Unable to process payment:", error);
        Alert.alert("Unable to process payment. Please try again later.");
        return;
      }

      const { paymentIntent, error: confirmError } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        billingDetails: billingDetails,
      });

      if (confirmError) {
        Alert.alert(`Payment Confirmation Error: ${confirmError.message}`);
        return;
      }

      if (paymentIntent) {
        Alert.alert("Payment successful");

        const userId = auth.currentUser?.uid; 
        if (userId) {
          const orderRef = ref(database, `/orders/${userId}`);
          const newOrderRef = push(orderRef);
          const orderData = {
            shippingInfo: {
              address: shippingInfo.address,
              city: shippingInfo.city,
              postalCode: shippingInfo.postalCode,
              fullName: shippingInfo.fullName,
              email: shippingInfo.email,
            },
            paymentIntent: paymentIntent,
          };
          set(newOrderRef, orderData)
            .then(() => console.log("Order details pushed to Firebase"))
            .catch((error) => console.error("Error pushing order details to Firebase:", error));
        }
      }
    } catch (e) {
      console.log("Payment Error:", e);
      Alert.alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
        <View style={styles.shippingInfo}>
          <Text style={styles.shippingInfoHeader}>Shipping Information</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="E-mail"
            keyboardType="email-address"
            value={shippingInfo.email}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, email: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Full Name"
            value={shippingInfo.fullName}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, fullName: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Address"
            value={shippingInfo.address}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, address: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="City"
            value={shippingInfo.city}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, city: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Postal Code"
            value={shippingInfo.postalCode}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, postalCode: text })}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.paymentMethodTitle}>Payment Method</Text>
          <CardField
            postalCodeEnabled={true}
            placeholders={{
              number: "4242 4242 4242 4242",
            }}
            cardStyle={styles.card}
            style={styles.cardContainer}
            onCardChange={cardDetails => {
              setCardDetails(cardDetails);
            }}
          />
        </View>
        <TouchableOpacity onPress={handlePayPress} style={styles.payButton} disabled={loading}>
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  totalText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A90E2',
    textAlign: 'center',
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#dddddd",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    height: 50,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  shippingInfo: {
    marginBottom: 30,
  },
  shippingInfoHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderColor: "#dddddd",
    borderWidth: 1,
  },
  cardContainer: {
    height: 50,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  paymentMethodContainer: {
    marginBottom: 40,
  },
  paymentMethodTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  payButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Checkout;
