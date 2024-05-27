import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';

const SearchAutocomplete = ({ data, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filteredItems = data.filter(item => item.toLowerCase().includes(text.toLowerCase()));
    setFilteredData(filteredItems);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onSelectItem(item)}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        onChangeText={handleSearch}
        value={searchTerm}
        placeholder="Search..."
      />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
};

export default SearchAutocomplete;
