import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { FinancialProvider } from './src/context/FinancialContext';
import HomeScreen from './src/screens/HomeScreen';
import IncomeScreen from './src/screens/IncomeScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import AssetsScreen from './src/screens/AssetsScreen';
import LiabilitiesScreen from './src/screens/LiabilitiesScreen';
import EditTimeSeriesScreen from './src/screens/EditTimeSeriesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <FinancialProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              title: 'Personal Finance Manager',
              headerStyle: {
                backgroundColor: '#2C3E50',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="Income"
            component={IncomeScreen}
            options={{
              headerStyle: {
                backgroundColor: '#2C3E50',
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="Expenses"
            component={ExpensesScreen}
            options={{
              headerStyle: {
                backgroundColor: '#2C3E50',
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="Assets"
            component={AssetsScreen}
            options={{
              headerStyle: {
                backgroundColor: '#2C3E50',
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="Liabilities"
            component={LiabilitiesScreen}
            options={{
              headerStyle: {
                backgroundColor: '#2C3E50',
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="EditTimeSeries" 
            component={EditTimeSeriesScreen}
            options={{ title: 'Edit Time Series Data' }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </FinancialProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
