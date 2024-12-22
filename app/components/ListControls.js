import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { sortOptions } from '../utils/listOperations';

const ListControls = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  sortBy,
  setSortBy,
  searchText,
  setSearchText,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
          style={styles.picker}
        >
          <Picker.Item label="All Categories" value="All" />
          {categories.map(cat => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sortBy}
          onValueChange={setSortBy}
          style={styles.picker}
        >
          {sortOptions.map(option => (
            <Picker.Item 
              key={option.value} 
              label={option.label} 
              value={option.value} 
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 40,
  },
});

export default ListControls;
