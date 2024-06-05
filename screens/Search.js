import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import SocialMediaContainer from './SocialMediaContainer';
import DarkMode from './settings/DarkMode'; // Import the DarkMode context

const Search = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkMode); // Access the dark mode state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [specialPicks, setSpecialPicks] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const db = getDatabase();
      const productsRef = ref(db, 'products');
      onValue(productsRef, (snapshot) => {
        const productsData = snapshot.val();
        if (productsData) {
          const productsArray = Object.keys(productsData).map(key => ({
            id: key,
            ...productsData[key],
          }));
          setAllProducts(productsArray);
          const shuffled = productsArray.sort(() => 0.5 - Math.random());
          setSpecialPicks(shuffled.slice(0, 6));
        }
      });
    };

    fetchProducts();
  }, []);

  const handleCategoryPress = (category) => {
    const categoryProducts = allProducts.filter(product => product.category === category);
    navigation.navigate('SearchResults', { searchQuery: '', category: category, products: categoryProducts });
  };

  const truncateDescription = (description) => {
    if (description.length > 80) {
      return `${description.substring(0, 50)}...`;
    }
    return description;
  };

  const truncateName = (name) => {
    if (name.length > 20) {
      return `${name.substring(0, 20)}...`;
    }
    return name;
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollViewContent, isDarkMode && styles.darkScrollViewContent]}>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <Searchbar
          placeholder="Search"
          style={[styles.searchbar, isDarkMode && styles.darkSearchbar]}
          inputStyle={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => navigation.navigate('SearchResults', { searchQuery })}
        />

        <View style={styles.categoriesContainer}>
          <Text style={[styles.categoryHeaderText, isDarkMode && styles.darkCategoryHeaderText]}>Shop by Category</Text>
          <View style={styles.categoryGrid}>
            {[
              { name: 'Machines', image: require('../assets/images/Categories/dumbell.png') },
              { name: 'Supplements', image: require('../assets/images/Categories/supplements.png') },
              { name: 'Shirts', image: require('../assets/images/Categories/shirt.png') },
              { name: 'Smartwatches', image: require('../assets/images/Categories/smartwatch.png') },
              { name: 'Accessories', image: require('../assets/images/Categories/gloves.png') },
            ].map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryCard, isDarkMode && styles.darkCategoryCard]}
                onPress={() => handleCategoryPress(category.name)}
              >
                <Image source={category.image} style={styles.categoryImage} />
                <Text style={[styles.categoryText, isDarkMode && styles.darkCategoryText]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.suggestedContainer}>
          <Text style={[styles.suggestedTitle, isDarkMode && styles.darkSuggestedTitle]}>Special Picks for You!</Text>
          <View style={styles.suggestedProductsGrid}>
            {specialPicks.map((product, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.suggestedProductCard, isDarkMode && styles.darkSuggestedProductCard]}
                onPress={() => navigation.navigate('ProductDetail', { product })}
              >
                <Image source={{ uri: product.image }} style={styles.suggestedProductImage} />
                <Text style={styles.suggestedProductName}>{truncateName(product.name)}</Text>
                <Text style={styles.suggestedProductPrice}>{`Price: $${parseFloat(product.price).toFixed(2)}`}</Text>
                <Text>{truncateDescription(product.description)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <SocialMediaContainer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  darkScrollViewContent: {
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  searchbar: {
    backgroundColor: '#EDEDED', // Light gray background
    marginBottom: 20,
    borderRadius: 10, // Add border radius for rounded corners
    elevation: 3, // Add elevation for a shadow effect
  },
  darkSearchbar: {
    backgroundColor: '#333333', // Dark gray background
  },
  searchInput: {
    color: '#000000', // Black text color
  },
  categoriesContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  categoryHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkCategoryHeaderText: {
    color: 'white',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    alignItems: 'center',
    marginBottom: 20,
    width: '48%',
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    padding: 20,
    // For iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // For Android
    elevation: 5,
  },
  darkCategoryCard: {
    backgroundColor: '#333333',
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    textAlign: 'center',
  },
  darkCategoryText: {
    color: 'white',
  },
  suggestedContainer: {
    marginTop: 20,
  },
  suggestedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkSuggestedTitle: {
    color: 'white',
  },
  suggestedProductsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  suggestedProductCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
    width: 150,
  },
  darkSuggestedProductCard: {
    backgroundColor: '#333333',
  },
  suggestedProductImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  suggestedProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  suggestedProductPrice: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
  },
});

export default Search;

