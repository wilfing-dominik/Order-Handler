import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import './styles/style';

//COMPONENTS
import HomeScreen from './components/HomeScreen';
import TableScreen from './components/TableScreen';
import AddProductToInventoryScreen from './components/AddProductToInventoryScreen';
import AddProductToTableScreen from './components/AddProductToTableScreen';
import AllProductScreen from './components/AllProductScreen';
import CompletedOrder from './components/CompletedOrder';
import EditProductInInventoryScreen from './components/EditProductInInventoryScreen';
import OrderHistoryScreen from './components/OrderHistoryScreen';

// GLOBALS
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{title: 'Összes asztal'}}></Stack.Screen>

        <Stack.Screen
          name="TableScreen"
          component={TableScreen}
          options={{title: 'Asztal ?'}}></Stack.Screen>

        <Stack.Screen
          name="AddProductToTableScreen"
          component={AddProductToTableScreen}
          options={{title: 'Új rendelés hozzáadása (Asztal x)'}}></Stack.Screen>

        <Stack.Screen
          name="AllProductScreen"
          component={AllProductScreen}
          options={{title: 'Összes termék'}}></Stack.Screen>

        <Stack.Screen
          name="AddProductToInventory"
          component={AddProductToInventoryScreen}
          options={{title: 'Új termék hozzáadása'}}></Stack.Screen>

        <Stack.Screen
          name="EditProductInInventory"
          component={EditProductInInventoryScreen}
          options={{title: 'Termék adatainak változtatása'}}></Stack.Screen>

        <Stack.Screen
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{title: 'Rendeléstörténet'}}></Stack.Screen>

        <Stack.Screen
          name="CompletedOrderScreen"
          component={CompletedOrder}
          options={{title: 'Rendelések ? dátum alatt'}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
