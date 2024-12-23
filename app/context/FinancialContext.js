import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FinancialContext = createContext();

const generatePast12MonthsData = () => {
  const data = {};
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = date.toISOString().split('T')[0].substring(0, 7);
    data[monthKey] = {
      netAsset: 0,
      cashflow: 0
    };
  }
  return data;
};

export const FinancialProvider = ({ children }) => {
  const [incomeItems, setIncomeItems] = useState([]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [assetItems, setAssetItems] = useState([]);
  const [liabilityItems, setLiabilityItems] = useState([]);
  const [monthlyHistoricalData, setMonthlyHistoricalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load data on app start
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await AsyncStorage.getItem('financeData');
        if (data) {
          const parsedData = JSON.parse(data);
          setIncomeItems(parsedData.incomeItems || []);
          setExpenseItems(parsedData.expenseItems || []);
          setAssetItems(parsedData.assetItems || []);
          setLiabilityItems(parsedData.liabilityItems || []);
          // Initialize with past 12 months if no historical data exists
          setMonthlyHistoricalData(parsedData.monthlyHistoricalData || generatePast12MonthsData());
        } else {
          // If no data exists at all, initialize with defaults including past 12 months
          setMonthlyHistoricalData(generatePast12MonthsData());
        }
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert(
          'Error',
          'Failed to load your data. Please try restarting the app.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const data = {
          incomeItems,
          expenseItems,
          assetItems,
          liabilityItems,
          monthlyHistoricalData
        };
        await AsyncStorage.setItem('financeData', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving data:', error);
        Alert.alert(
          'Error',
          'Failed to save your changes. Please try again.'
        );
      }
    };

    if (!isLoading) {  // Don't save while initial loading
      saveData();
    }
  }, [incomeItems, expenseItems, assetItems, liabilityItems, monthlyHistoricalData]);

  const calculateTotalIncome = () => {
    return incomeItems.reduce((total, item) => total + item.amount, 0);
  };

  const calculateTotalExpenses = () => {
    return expenseItems.reduce((total, item) => total + item.amount, 0);
  };

  const calculateCashflow = (date) => {
    if (date) {
      const monthKey = date.toISOString().split('T')[0].substring(0, 7);
      return monthlyHistoricalData[monthKey]?.cashflow || 0;
    }
    return calculateTotalIncome() - calculateTotalExpenses();
  };

  const calculateTotalAssets = () => {
    return assetItems.reduce((total, item) => total + item.amount, 0);
  };

  const calculateTotalLiabilities = () => {
    return liabilityItems.reduce((total, item) => total + item.amount, 0);
  };

  const calculateNetWorth = (date) => {
    if (date) {
      const monthKey = date.toISOString().split('T')[0].substring(0, 7);
      return monthlyHistoricalData[monthKey]?.netAsset || 0;
    }
    return calculateTotalAssets() - calculateTotalLiabilities();
  };

  const updateMonthlyData = (monthlyData) => {
    const newHistoricalData = {};
    monthlyData.forEach(item => {
      newHistoricalData[item.monthKey] = {
        netAsset: item.netAsset,
        cashflow: item.cashflow
      };
    });
    setMonthlyHistoricalData(newHistoricalData);
  };

  const getAllMonthlyData = () => {
    return Object.entries(monthlyHistoricalData)
      .map(([monthKey, data]) => ({
        monthKey,
        month: parseInt(monthKey.split('-')[1]),
        year: parseInt(monthKey.split('-')[0]),
        netAsset: data.netAsset,
        cashflow: data.cashflow
      }))
      .sort((a, b) => b.monthKey.localeCompare(a.monthKey)); // Keep descending order for table view
  };

  const getLatest12MonthsData = () => {
    const allData = getAllMonthlyData();
    // First slice to get last 12 months, then reverse to show oldest to newest for the plot
    return allData.slice(0, 12).reverse();
  };

  return (
    <FinancialContext.Provider
      value={{
        incomeItems,
        setIncomeItems,
        expenseItems,
        setExpenseItems,
        calculateTotalIncome,
        calculateTotalExpenses,
        calculateCashflow,
        assetItems,
        setAssetItems,
        liabilityItems,
        setLiabilityItems,
        calculateTotalAssets,
        calculateTotalLiabilities,
        calculateNetWorth,
        updateMonthlyData,
        getAllMonthlyData,
        getLatest12MonthsData,
        isLoading,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => useContext(FinancialContext);
