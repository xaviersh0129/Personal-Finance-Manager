import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FinancialContext = createContext();

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
          setMonthlyHistoricalData(parsedData.monthlyHistoricalData || {});
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
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey)); // Changed sort order to ascending
  };

  const getLatest12MonthsData = () => {
    const allData = getAllMonthlyData();
    return allData.slice(-12); // Get last 12 items instead of first 12
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
