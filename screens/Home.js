import React, { useContext, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import Slideshow from 'react-native-image-slider-show';
import { Rating } from 'react-native-ratings';
import ProductData from './Data/ProductData'; // Import ProductData
import SearchAutocomplete from './Data/SearchAutoComplete'; 

const { width: screenWidth } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (searchQuery) {
      navigation.navigate('SearchResults', { searchQuery });
    }
  };

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

  const images = [
    { url: require('./../assets/images/SALES/smartwatch.png') },
    { url: require('./../assets/images/SALES/1.png') },
    { url: require('./../assets/images/SALES/30.png') },
  ];

  const specialPicksIds = [11, 12, 13, 14, 15];
  const specialPicks = ProductData.filter(product => specialPicksIds.includes(product.id));

  return (
    <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
      <View style={[styles.container]}>
        <View style={[styles.blueContainer]}>
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search"
              style={styles.searchbar}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
            />
            <TouchableOpacity onPress={() => console.log("Button pressed")} style={styles.iconContainer}>
              <Image source={require('../assets/images/reorder-horizontal.png')} style={styles.iconImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.membershipContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Membership')}>
            <Image source={require('../assets/images/Membership/try.png')} style={styles.membershipImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.topContainer}>
          <Text style={styles.specialPicksText}>Special Picks for You!</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <View style={styles.topCategoriesContainer}>
              {specialPicks.map((product, index) => (
                <TouchableOpacity key={index} style={styles.topCategoryItem} onPress={() => handleNavigation(product.id)}>
                  <Image source={product.image} style={styles.topCarouselImage} />
                  <Text style={styles.categoryText}>{product.name}</Text>
                  <Text style={styles.categoryDescription}>{truncateDescription(product.description)}</Text>
                  <Text style={[styles.productPrice]}>{`Price: $${product.price.toFixed(2)}`}</Text>
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
          </ScrollView>
        </View>

        <View style={[styles.slideableContainer, { height: 200 }]}>
          <Slideshow
            dataSource={images}
            height={200}
            arrowSize={20}
            indicatorSize={20}
            overlay={false}
            indicatorColor="#CCCCCC"
            indicatorSelectedColor="#FFFFFF"
            containerStyle={styles.slideshowContainer}
            titleStyle={styles.slideshowTitle}
            captionStyle={styles.slideshowCaption}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.categoryHeaderText}>Shop by Category</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <View style={styles.categoryItemsContainer}>
              {[
                { name: 'Gym', image: require('../assets/images/Categories/gym.png') },
                { name: 'Protein Powder', image: require('../assets/images/Categories/protein-powder.png') },
                { name: 'T-shirt', image: require('../assets/images/Categories/tshirt.png') },
                { name: 'Smartwatch', image: require('../assets/images/Categories/smartwatch.png') },
                { name: 'Towels', image: require('../assets/images/Categories/towels.png') },
              ].map((category, index) => (
                <View key={index} style={styles.categoryItem}>
                  <Image source={category.image} style={styles.carouselImage} />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 0,
    backgroundColor: '#F1FAFE',
  },
  blueContainer: {
    height: 80,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchbar: {
    backgroundColor: 'white',
    color: 'black',
    flex: 1,
  },
  iconContainer: {
    padding: 10,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  topContainer: {
    backgroundColor: 'white',
    marginTop: 50,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 310,
  },
  specialPicksText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  topCategoriesContainer: {
    flexDirection: 'row',
  },
  topCategoryItem: {
    alignItems: 'center',
    marginHorizontal: 20,
    width: 150,
  },
  topCarouselImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  categoryDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 14,
    color: '#007AFF', // Default color for light mode
    textAlign: 'center',
    marginBottom: 5, // Add some margin at the bottom
  },
  rating: {
    marginTop: 10,
  },
  slideableContainer: {
    backgroundColor: '#FFF',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  slideshowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  categoryItemsContainer: {
    flexDirection: 'row',
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 100,
  },
  carouselImage: {
    width: 60,
    height: 60,
  },
  membershipContainer: {
    width: screenWidth,
    alignSelf: 'center',
    marginBottom: -50,
    marginTop: -22,
    height: 215,
    justifyContent: 'center',
  },
  membershipImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
