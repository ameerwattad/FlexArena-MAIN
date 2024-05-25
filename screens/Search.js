import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Card, Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DarkModeContext from './settings/DarkMode'; // Import the context

export default function Search({ navigation }) {
  const { isDarkMode } = useContext(DarkModeContext); // Use the context

  return (
    <>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <Searchbar
          placeholder='Search...'
          style={[styles.searchbar, isDarkMode && styles.darkSearchbar]}
          inputStyle={isDarkMode ? styles.darkInput : styles.input}
          placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
          <Ionicons name='list' size={30} color={isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}> 
        <Text style={[styles.categoryText, isDarkMode && styles.darkCategoryText]}> 
          Categories:
        </Text>
      </View>
      {['Supplements', 'Clothes', 'Machines', 'Watches', 'Accessories'].map((category, index) => (
        <View key={index} style={styles.cardContainer}>
          <TouchableOpacity onPress={() => navigation.navigate(category)}>
            <Card style={[styles.card, isDarkMode && styles.darkCard]}>
              <Card.Content style={styles.cardContent}>
                <Text style={[styles.cardTitle, isDarkMode && styles.darkCardTitle]}>{category}</Text>
                <Ionicons name='arrow-forward-sharp' size={20} color={isDarkMode ? 'white' : 'black'} style={styles.iconcontainer} />
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00ffff',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  searchbar: {
    backgroundColor: 'white',
    width: '85%',
    height: 50,
    marginTop: 5,
    marginLeft: 5,
  },
  darkSearchbar: {
    backgroundColor: '#555',
  },
  input: {
    color: 'black',
  },
  darkInput: {
    color: 'white',
  },
  searchButton: {
    marginLeft: 5,
    marginTop: 10,
  },
  categoryText: {
    marginLeft: 10,
    marginTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  darkCategoryText: {
    color: 'white',
  },
  cardContainer: {
    margin: -10,
    marginLeft: 10,
    height: 100,
    width: '95%',
  },
  card: {
    marginBottom: 1,
  },
  darkCard: {
    backgroundColor: '#444',
  },
  cardTitle: {
    fontSize: 20,
    color: 'black',
  },
  darkCardTitle: {
    color: 'white',
  },
  iconcontainer: { 
    marginLeft: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
