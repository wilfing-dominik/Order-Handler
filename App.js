import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import './styles/style';

//COMPONENTS
import HomeScreen from './components/Home';
import TableScreen from './components/OrdersByTable';
import AddProductToInventoryScreen from './components/AddProduct';
import AddProductToTableScreen from './components/AddOrder';
import AllProductScreen from './components/AllProduct';
import CompletedOrder from './components/CompletedOrder';
import EditProductInInventoryScreen from './components/EditProduct';
import OrderHistoryScreen from './components/OrderHistory';

// GLOBALS
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{title: 'Összes asztal', headerShown: false}}></Stack.Screen>

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
