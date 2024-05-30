import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductsList = ({ products, onProductPress, onRemoveProduct }) => {
  const [showList, setShowList] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowList(!showList)} style={styles.button}>
        <Text style={styles.buttonText}>Products List</Text>
      </TouchableOpacity>
      {showList && (
        <View style={styles.listContainer}>
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  button: {
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
  listContainer: {
    marginTop: 8,
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
