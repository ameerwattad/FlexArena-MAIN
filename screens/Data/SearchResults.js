import React, { useContext, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import DarkModeContext from '../settings/DarkMode';
import ProductData from './ProductData';
import ModalDropdown from 'react-native-modal-dropdown';

export default function SearchResults() {
  const { isDarkMode } = useContext(DarkModeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { searchQuery } = route.params;
  
  const [filteredProducts, setFilteredProducts] = useState(
    ProductData.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleNavigation = (productId) => {
    const product = ProductData.find(item => item.id === productId);
    if (product) {
      navigation.navigate('ProductDetail', { product });
    } else {
      console.error(`Product with ID ${productId} not found`);
    }
  };

  const truncateDescription = (description) => {
    if (description.length > 80) {
      return `${description.substring(0, 50)}...`;
    }
    return description;
  };

  const handleSort = (index, option) => {
    let sortedProducts = [...filteredProducts];
    switch (option) {
      case 'Price: Low to High':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'Name: A-Z':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Name: Z-A':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Rating: High to Low':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollViewContent, isDarkMode && styles.darkScrollViewContent]}>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <Text style={[styles.headerText, isDarkMode && styles.darkHeaderText]}>
          Search Results for "{searchQuery}"
        </Text>
        <Text style={[styles.resultCount, isDarkMode && styles.darkResultCount]}>
          <Text style={styles.highlightText}>{filteredProducts.length}</Text> results found
        </Text>
        <View style={styles.filterSortContainer}>
          <ModalDropdown
            options={['Price: Low to High', 'Price: High to Low', 'Name: A-Z', 'Name: Z-A', 'Rating: High to Low']}
            defaultIndex={0}
            defaultValue="Filter & Sort"
            onSelect={(index, value) => handleSort(index, value)}
            dropdownStyle={[styles.dropdown, isDarkMode && styles.darkDropdown]}
            textStyle={[styles.filterSortText, isDarkMode && styles.darkFilterSortText]}
            dropdownTextStyle={styles.dropdownText}
            dropdownTextHighlightStyle={styles.dropdownTextHighlight}
          />
        </View>
        <View style={styles.productContainer}>
          {filteredProducts.map((product, index) => (
            <TouchableOpacity key={index} style={styles.productItem} onPress={() => handleNavigation(product.id)}>
              <Image source={product.image} style={styles.productImage} />
              <Text style={[styles.productName, isDarkMode && styles.darkProductName]}>{product.name}</Text>
              <Text style={[styles.productDescription, isDarkMode && styles.darkProductDescription]}>
                {truncateDescription(product.description)}
              </Text>
              <Text style={styles.productPrice}>{`Price: $${product.price.toFixed(2)}`}</Text>
              <Rating
                type='star'
                ratingCount={5}
                imageSize={20}
                startingValue={product.rating}
                readonly
                style={styles.rating}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  darkScrollViewContent: {
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  darkHeaderText: {
    color: 'white',
  },
  resultCount: {
    fontSize: 16,
    textAlign: 'center',
    marginRight:280,
    marginTop:20,
  },
  darkResultCount: {
    color: 'gray',
  },
  highlightText: {
    color: '#007AFF',
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterSortText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft:250,
    marginTop:-20,
  },
  darkFilterSortText: {
    color: 'white',
  },
  productContainer: {
    paddingHorizontal: 10,
  },
  productItem: {
    marginBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingBottom: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  darkProductName: {
    color: 'white',
  },
  productDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  darkProductDescription: {
    color: 'gray',
  },
  productPrice: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  rating: {
    marginTop: 5,
  },
  dropdown: {
    width: 200,
    backgroundColor: 'white',
  },
  darkDropdown: {
    backgroundColor: '#444',
  },
  dropdownText: {
    fontSize: 16,
    padding: 10,
  },
  dropdownTextHighlight: {
    color: '#007AFF',
  },
});
