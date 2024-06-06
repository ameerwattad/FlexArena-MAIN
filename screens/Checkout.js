import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';

// Replace 'YOUR_LOCAL_NETWORK_IP' with your actual IP address.
const API_URL = "http://10.0.0.9:3000";

const Checkout = props => {
  const [email, setEmail] = useState('');
  const [cardDetails, setCardDetails] = useState({});
  const { confirmPayment } = useConfirmPayment();
  const [loading, setLoading] = useState(false);

  const fetchPaymentIntentClientSecret = async () => {
    try {
      console.log("Fetching payment intent client secret...");
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { clientSecret, error } = await response.json();
      if (error) {
        console.log("Error from server:", error);
        return { error };
      }
      console.log("Received client secret:", clientSecret);
      return { clientSecret };
    } catch (error) {
      console.log('Error fetching payment intent client secret:', error);
      return { error: 'Network request failed' };
    }
  };

  const handlePayPress = async () => {
    if (!cardDetails?.complete || !email) {
      Alert.alert("Please enter complete card details and email");
      return;
    }

    const billingDetails = { email: email };
    console.log("Initiating payment with billing details:", billingDetails);

    try {
      setLoading(true);
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();
      if (error) {
        console.log("Unable to process payment:", error);
        Alert.alert("Unable to process payment:", error);
        setLoading(false);
      } else {
        const { paymentIntent, error: confirmError } = await confirmPayment(clientSecret, {
          paymentMethodType: "Card", // Ensure the payment method type is provided
          paymentMethodData: {
            billingDetails: billingDetails,
          },
        });

        if (confirmError) {
          Alert.alert(`Payment Confirmation Error: ${confirmError.message}`);
          console.log(`Payment Confirmation Error: ${confirmError.message}`);
        } else if (paymentIntent) {
          Alert.alert("Payment Successful");
          console.log("Payment successful", paymentIntent);
        }
        setLoading(false);
      }
    } catch (e) {
      console.log('Error handling payment:', e);
      Alert.alert('Error handling payment:', e.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize='none'
        placeholder='E-mail'
        keyboardType='email-address'
        onChange={value => setEmail(value.nativeEvent.text)}
        style={styles.input}
      />
      <CardField
        postalCodeEnabled={true}
        placeholders={{ number: "4242 4242 4242 4242" }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={cardDetails => {
          console.log("Card details changed:", cardDetails);
          setCardDetails(cardDetails);
        }}
      />
      <Button onPress={handlePayPress} title="Pay" disabled={loading} />
      {loading && <Text>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#efefefef",
    borderRadius: 8,
    fontSize: 20,
    height: 50,
    padding: 10,
  },
  card: {
    backgroundColor: "#efefefef",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
});

export default Checkout;
