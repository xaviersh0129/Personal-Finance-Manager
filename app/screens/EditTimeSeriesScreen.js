import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import { useFinancial } from '../context/FinancialContext';

const EditTimeSeriesScreen = ({ navigation }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const { getAllMonthlyData, updateMonthlyData } = useFinancial();

  useEffect(() => {
    const data = getAllMonthlyData();
    setMonthlyData(data);
  }, []);

  const handleValueChange = (index, field, value) => {
    const newData = [...monthlyData];
    newData[index] = {
      ...newData[index],
      [field]: parseFloat(value) || 0
    };
    setMonthlyData(newData);
  };

  const addNewMonth = () => {
    // Get the last month in the data or current month if empty
    let newDate;
    if (monthlyData.length > 0) {
      const lastDate = new Date(monthlyData[0].year, 
        monthlyData[0].month.toString().padStart(2, '0') - 1);
      newDate = new Date(lastDate.setMonth(lastDate.getMonth() + 1));
    } else {
      newDate = new Date();
    }

    const newMonthData = {
      monthKey: `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`,
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
      netAsset: 0,
      cashflow: 0
    };

    setMonthlyData([newMonthData, ...monthlyData]);
  };

  const handleSave = () => {
    try {
      updateMonthlyData(monthlyData);
      Alert.alert(
        "Success",
        "Monthly data has been updated successfully",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update monthly data");
    }
  };

  const formatMonth = (month) => {
    const date = new Date(2000, month - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <Text style={styles.title}>Edit Monthly Financial Data</Text>
        
        <TouchableOpacity style={styles.addButton} onPress={addNewMonth}>
          <Text style={styles.addButtonText}>+ Add New Month</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.row}>
          <Text style={[styles.headerCell, { flex: 2 }]}>Month</Text>
          <Text style={[styles.headerCell, { flex: 1.5 }]}>Net Assets</Text>
          <Text style={[styles.headerCell, { flex: 1.5 }]}>Cashflow</Text>
        </View>

        {/* Data Rows */}
        {monthlyData.map((item, index) => (
          <View key={item.monthKey} style={styles.row}>
            <Text style={[styles.cell, { flex: 2 }]}>
              {`${formatMonth(item.month)} ${item.year}`}
            </Text>
            <TextInput
              style={[styles.input, { flex: 1.5 }]}
              value={item.netAsset.toString()}
              onChangeText={(value) => handleValueChange(index, 'netAsset', value)}
              keyboardType="numeric"
              placeholder="0"
            />
            <TextInput
              style={[styles.input, { flex: 1.5 }]}
              value={item.cashflow.toString()}
              onChangeText={(value) => handleValueChange(index, 'cashflow', value)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  card: {
    borderRadius: 10,
    margin: 10,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#2C3E50',
    fontSize: 16,
  },
  cell: {
    color: '#2C3E50',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 8,
    marginHorizontal: 4,
    fontSize: 14,
    color: '#2C3E50',
  },
  saveButton: {
    backgroundColor: '#27AE60',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#3498DB',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  addButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EditTimeSeriesScreen;
