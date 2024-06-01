import React from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';

const ProductsList = ({ products, onProductPress, onRemoveProduct }) => (
  <View style={styles.container}>
    <View style={styles.listContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {products.map((product) => (
          <View key={product.id} style={styles.productContainer}>
            {product.image && <Image source={{ uri: product.image }} style={styles.productImage} />}
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <Button title="Details" onPress={() => onProductPress(product)} />
              <Button title="Remove" onPress={() => onRemoveProduct(product.id)} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  listContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16, // Adds padding to the bottom to ensure last item is accessible
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
  },
  productImage: {
    width: 50,
    height: 100,
    marginRight: 8,
  },
  productDetails: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ProductsList;
