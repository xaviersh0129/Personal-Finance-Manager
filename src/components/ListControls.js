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
        placeholderTextColor="#999"
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item 
            label="All Categories" 
            value="All" 
            style={styles.pickerItem}  // Added style here
          />
          {categories.map(cat => (
            <Picker.Item 
              key={cat} 
              label={cat} 
              value={cat}
              style={styles.pickerItem}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sortBy}
          onValueChange={setSortBy}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {sortOptions.map(option => (
            <Picker.Item 
              key={option.value} 
              label={option.label} 
              value={option.value}
              style={styles.pickerItem}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
    fontSize: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 8,
    height: 50, // Increased height for better visibility
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50, // Match container height
    color: '#000000',
    backgroundColor: '#FFFFFF',
    fontSize: 14, // Consistent font size
  },
  pickerItem: {
    fontSize: 14, // Consistent font size
    color: '#000000',
    height: 50, // Match container height
  },
});

export default ListControls;
