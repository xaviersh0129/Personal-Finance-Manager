import React, { createContext, useState, useContext } from 'react';

const FinancialContext = createContext();

export const FinancialProvider = ({ children }) => {
  const [incomeItems, setIncomeItems] = useState([]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [assetItems, setAssetItems] = useState([]);
  const [liabilityItems, setLiabilityItems] = useState([]);

  const calculateTotalIncome = () => {
    return incomeItems.reduce((total, item) => total + item.amount, 0);
  };

  const calculateTotalExpenses = () => {
    return expenseItems.reduce((total, item) => total + item.amount, 0);
  };

  const calculateCashflow = () => {
    return calculateTotalIncome() - calculateTotalExpenses();
  };

  const calculateTotalAssets = () => {
    return assetItems.reduce((total, item) => total + item.amount, 0);
  };

  const calculateTotalLiabilities = () => {
    return liabilityItems.reduce((total, item) => total + item.amount, 0);
  };

  const calculateNetWorth = () => {
    return calculateTotalAssets() - calculateTotalLiabilities();
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
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => useContext(FinancialContext);
