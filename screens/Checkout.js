import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';

const API_URL = "http://10.0.0.130:3000";

export default function Checkout() {
  const [email, setEmail] = useState('');
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    if (!cardDetails?.complete || !email) {
      Alert.alert("Please enter complete card details and email");
      return;
    }

    const billingDetails = {
      email: email,
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
        console.log("Payment successful", paymentIntent);
      }
    } catch (e) {
      console.log("Payment Error:", e);
      Alert.alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="E-mail"
        keyboardType="email-address"
        onChange={value => setEmail(value.nativeEvent.text)}
        style={styles.input}
      />
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
      <Button onPress={handlePayPress} title="Pay" disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  input: {
    backgroundColor: "#efefef",
    borderRadius: 8,
    fontSize: 20,
    height: 50,
    padding: 10,
  },
  card: {
    backgroundColor: "#efefef",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
});
