import React, { useContext, useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import DarkModeContext from '../settings/DarkMode';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import ModalDropdown from 'react-native-modal-dropdown';

export default function SearchResults() {
  const { isDarkMode } = useContext(DarkModeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { searchQuery, category } = route.params;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log('Data retrieved from Firebase:', data);
        const productList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProducts(productList);
        filterProducts(productList, searchQuery, category); // Initial filter when data is loaded
      } else {
        console.log('No data available');
        setProducts([]);
        setFilteredProducts([]);
      }
      setLoading(false); // Set loading to false after data is fetched
    });
  }, []);

  useEffect(() => {
    filterProducts(products, searchQuery, category); // Re-trigger filter when searchQuery or category changes
  }, [searchQuery, category, products]);

  const filterProducts = (productsList, query, category) => {
    const trimmedQuery = query.trim().toLowerCase();
    const filteredList = productsList.filter(product =>
      product.name.toLowerCase().includes(trimmedQuery) &&
      (!category || product.category === category)
    );
    console.log('Filtered products:', filteredList);
    setFilteredProducts(filteredList);
  };

  const handleNavigation = (productId) => {
    const product = products.find(item => item.id === productId);
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
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'Price: High to Low':
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
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
        {category && (
          <Text style={[styles.headerText, isDarkMode && styles.darkHeaderText]}>
            Category: "{category}"
          </Text>
        )}
        {loading ? ( // Show loading indicator if loading
          <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
        ) : (
          <>
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
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <Text style={[styles.productName, isDarkMode && styles.darkProductName]}>{product.name}</Text>
                  <Text style={[styles.productDescription, isDarkMode && styles.darkProductDescription]}>
                    {truncateDescription(product.description)}
                  </Text>
                  <Text style={styles.productPrice}>
                    {product.discount ? `Discounted Price: $${(product.price * (1 - product.discount / 100)).toFixed(2)} (Discount: ${product.discount}%)` : `Price: $${product.price}`}
                  </Text>
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
          </>
        )}
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
    marginRight: 280,
    marginTop: 20,
  },
  darkResultCount: {
    color: 'white',
  },
  highlightText: {
    fontWeight: 'bold',
    color: 'red',
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dropdown: {
    width: 150,
    height: 120,
    marginTop: 10,
  },
  darkDropdown: {
    backgroundColor: '#666',
  },
  filterSortText: {
    fontSize: 16,
  },
  darkFilterSortText: {
    color: 'white',
  },
  dropdownText: {
    fontSize: 16,
    paddingLeft: 10,
  },
  dropdownTextHighlight: {
    color: 'blue',
  },
  productContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  productItem: {
    width: '90%', // Adjust width to take up 90% of the container width
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1, // Add border width
    borderColor: '#ccc', // Add border color
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  darkProductName: {
    color: 'white',
  },
  productDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  darkProductDescription: {
    color: 'white',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  rating: {
    marginTop: 10,
  },
});
