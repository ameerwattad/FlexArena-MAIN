import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Card, Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function Search({navigation}) {
  return (
    <>
      <View style={styles.container}>
        <Searchbar
          placeholder='Search...'
          style={styles.searchbar}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
          <Ionicons name='list' size={30} color='black' />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}> 
        <Text style={styles.categoryText}> 
          Categories:
        </Text>
      </View>
      <View style={styles.cardContainer}> 
        <TouchableOpacity onPress={() =>navigation.navigate('Supplements')}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>Supplements</Text>
              <Ionicons name='arrow-forward-sharp' size={20} color='black' style={styles.iconcontainer} />  
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}> 
        <TouchableOpacity onPress={() => navigation.navigate('Clothes')}>
          <Card style={styles.card}>
            <Card.Content  style={styles.cardContent}>
              <Text style={styles.cardTitle}>Clothes</Text>
              <Ionicons name='arrow-forward-sharp' size={20} color='black' style={styles.iconcontainer} />
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}> 
        <TouchableOpacity onPress={() => navigation.navigate('Machines')}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>Machines</Text>
              <Ionicons name='arrow-forward-sharp' size={20} color='black' style={styles.iconcontainer}/>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}> 
        <TouchableOpacity onPress={() => navigation.navigate('Watches')}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>Smart watches</Text>
              <Ionicons name='arrow-forward-sharp' size={20} color='black' style={styles.iconcontainer}/>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}> 
        <TouchableOpacity onPress={() => navigation.navigate('Accessories')}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>Accessories</Text>
              <Ionicons name='arrow-forward-sharp' size={20} color='black' style={styles.iconcontainer}/>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>
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
  searchbar: {
    backgroundColor: 'white',
    width: '85%',
    height: 50,
    marginTop: 5,
    marginLeft: 5,
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
  },
  categoriesButtons: {
    marginTop: 1,
    marginLeft: 10,
  },
  cardContainer: {
    margin: -10,
    marginLeft:10,
    height:100,
    width:'95%'
  },
  card: {
    marginBottom: 1,
  },
  cardTitle: {
    fontSize: 20,
    
  },
  iconcontainer:{ 
    marginLeft:10
    
  },
  cardContent:{
    flexDirection:'row', 
    justifyContent:'space-between',
    alignItems:'center'
  }
});
