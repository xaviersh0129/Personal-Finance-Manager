import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements';
import { useFinancial } from './context/FinancialContext';
import { calculateNetAssetGoal } from './utils/calculations';
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const { calculateCashflow, calculateNetWorth, isLoading } = useFinancial();  // Add calculateNetWorth

  const netWorth = calculateNetWorth();
  const netAssetGoal = age ? calculateNetAssetGoal(age) : 0;
  const goalDifference = netWorth - netAssetGoal;

  const handleSubmit = () => {
    if (name && age) {
      setIsEditing(false);
    }
  };

  const navigationButtons = [
    { title: 'Income', color: '#27AE60' },
    { title: 'Expenses', color: '#E74C3C' },
    { title: 'Assets', color: '#3498DB' },
    { title: 'Liabilities', color: '#E67E22' },
  ];

  // Modify getMonthlyData to prepare data chronologically
  const getMonthlyData = () => {
    const monthsData = useFinancial().getLatest12MonthsData();
    return {
      labels: monthsData.map(d => {
        const date = new Date(d.year, d.month - 1);
        return date.toLocaleString('default', { month: 'short' });
      }),
      data: monthsData
    };
  };

  const monthlyData = getMonthlyData();
  
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userProfileSection}>
        {isEditing ? (
          <Card containerStyle={styles.formCard}>
            <Card.Title>Your Profile</Card.Title>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <Card containerStyle={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.profileAge}>Age: {age}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      </View>

      <View style={styles.financialSection}>
        <Card containerStyle={styles.financialCard}>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Net Asset</Text>
            <Text style={[
              styles.financialValue,
              { color: calculateNetWorth() >= 0 ? '#27AE60' : '#E74C3C' }
            ]}>
              ${calculateNetWorth().toLocaleString()}
            </Text>
          </View>
        </Card>

        <Card containerStyle={styles.financialCard}>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Cashflow</Text>
            <Text style={[
              styles.financialValue,
              { color: calculateCashflow() >= 0 ? '#27AE60' : '#E74C3C' }
            ]}>
              ${calculateCashflow().toLocaleString()}
            </Text>
          </View>
        </Card>
      </View>

      {/* Chart Section */}
      <Card containerStyle={styles.chartCard}>
        <Text style={styles.chartTitle}>Monthly Overview</Text>
        <LineChart
          data={{
            labels: monthlyData.labels,
            datasets: [
              {
                data: monthlyData.data.map(d => d.netAsset),
                color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Bright blue
                strokeWidth: 2,
                withDots: true,
                withShadow: false,
                backgroundColor: 'rgba(52, 152, 219, 0.2)', // Light blue background
              },
              {
                data: monthlyData.data.map(d => d.cashflow),
                color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`, // Purple
                strokeWidth: 2,
                withDots: true,
                withShadow: false,
                backgroundColor: 'rgba(155, 89, 182, 0.2)', // Light purple background
              }
            ],
            legend: ["Net Assets", "Cashflow"]
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          withVerticalLines={false}
          withHorizontalLines={true}
          withInnerLines={false}
          fromZero={true}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditTimeSeries')}
        >
          <Text style={styles.editButtonText}>Edit Time Series Data</Text>
        </TouchableOpacity>
      </Card>

      <Card containerStyle={styles.goalCard}>
        <Text style={styles.goalLabel}>Net Asset Goals</Text>
        <View style={styles.goalRow}>
          <Text style={styles.goalText}>Age Goal:</Text>
          <Text style={styles.goalAmount}>${netAssetGoal.toLocaleString()}</Text>
        </View>
        <View style={styles.goalRow}>
          <Text style={styles.goalText}>Difference:</Text>
          <Text style={[
            styles.goalAmount,
            { color: goalDifference >= 0 ? '#27AE60' : '#E74C3C' }
          ]}>
            ${goalDifference.toLocaleString()}
          </Text>
        </View>
      </Card>

      <View style={styles.navigationSection}>
        {navigationButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.navButton, { backgroundColor: button.color }]}
            onPress={() => navigation.navigate(button.title)}
          >
            <Text style={styles.navButtonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  userProfileSection: {
    padding: 10,
    backgroundColor: '#2C3E50',
  },
  formCard: {
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2C3E50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  profileCard: {
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  profileAge: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 5,
  },
  editButton: {
    color: '#3498DB',
    fontSize: 16,
  },
  financialSection: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  financialCard: {
    borderRadius: 10,
    flex: 1,
    margin: 5,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  financialItem: {
    alignItems: 'center',
  },
  financialLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  financialValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  navigationSection: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navButton: {
    width: '48%',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  goalCard: {
    borderRadius: 10,
    margin: 10,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  goalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  goalText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  goalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  chartCard: {
    borderRadius: 10,
    margin: 10,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#3498DB',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#2C3E50',
    fontSize: 16,
  },
});

export default HomeScreen;
