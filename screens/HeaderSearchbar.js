import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function HeaderSearchbar() {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const categories = ["Whey protein", "Mass gainer", "Creatine", "Category 4", "Category 5"];

    const handleList = () => {
        setDropdownVisible(!dropdownVisible);
    }

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Searchbar
                    style={styles.container}
                    placeholder='Search...  FlexArena'
                    inputStyle={styles.input}
                />
                <TouchableOpacity onPress={handleList}>
                    <Ionicons name='list' color='white' size={30} style={styles.list} />
                </TouchableOpacity>
            </View>

            {dropdownVisible && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={categories}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.categoryItem} onPress={() => {
                                setDropdownVisible(false);
                                console.log(item);
                            }}>
                                <Text style={styles.categoryText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item}
                    />
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '89%',
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        height: '70%',
        top: 9
    },
    textContainer: {
        top: 15,
        fontSize: 15,
        color: 'white'
    },
    input: {
        top: -8
    },
    list: {
        top: 12
    },
    dropdown: {
        position: 'absolute',
        top: 60, 
        left: 10,
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000 
    },
    categoryItem: {
        padding: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    categoryText: {
        fontSize: 16,
        color: 'black'
    }
});
