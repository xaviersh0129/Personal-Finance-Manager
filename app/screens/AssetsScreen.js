import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  TextInput,
} from 'react-native';
import { Card } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { useFinancial } from '../context/FinancialContext';
import { sortItems, filterItems } from '../utils/listOperations';
import ListControls from '../components/ListControls';

const AssetsScreen = () => {
  const { assetItems, setAssetItems, calculateTotalAssets } = useFinancial();
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Real Estate');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchText, setSearchText] = useState('');

  const categories = ['Real Estate', 'Vehicles', 'Cash', 'Business', 'Saving', 'Stocks/Funds/CDs'];

  const handleAmountChange = (text) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;

    setAmount(numericValue);
  };

  const handleAddAsset = () => {
    if (amount && description) {
      const newItem = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        description,
        category,
        timestamp: new Date().toISOString(),
      };
      setAssetItems([newItem, ...assetItems]);
      setShowForm(false);
      setAmount('');
      setDescription('');
      setCategory('Real Estate');
    }
  };

  const handleDeleteAsset = (id) => {
    setAssetItems(assetItems.filter(item => item.id !== id));
  };

  const filteredAndSortedItems = useMemo(() => {
    const filtered = filterItems(assetItems, selectedCategory, searchText);
    return sortItems(filtered, sortBy);
  }, [assetItems, selectedCategory, sortBy, searchText]);

  const renderAssetItem = ({ item }) => (
    <Card containerStyle={styles.assetItem}>
      <View style={styles.itemHeader}>
        <View>
          <Text style={styles.amount}>${parseFloat(item.amount).toLocaleString()}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteAsset(item.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ListControls
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <FlatList
        data={filteredAndSortedItems}
        renderItem={renderAssetItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No asset items yet</Text>
        }
        ListFooterComponent={
          <Card containerStyle={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Assets</Text>
            <Text style={styles.totalAmount}>
              ${calculateTotalAssets().toLocaleString()}
            </Text>
          </Card>
        }
      />

      {showForm ? (
        <Card containerStyle={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
            maxLength={10}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
              mode="dropdown"
            >
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} color="#2C3E50" />
              ))}
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleAddAsset}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : (
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.addButtonText}>Add Asset</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  list: {
    flex: 1,
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#95A5A6',
    marginTop: 20,
  },
  assetItem: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498DB',  // Blue color for assets
  },
  description: {
    fontSize: 16,
    color: '#2C3E50',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 5,
  },
  formCard: {
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#3498DB',  // Blue color for assets
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#3498DB',  // Blue color for assets
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  category: {
    fontSize: 14,
    color: '#3498DB',
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  totalCard: {
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#2C3E50',
  },
  totalLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default AssetsScreen;
