import React, {Button} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import './styles/style';

//COMPONENTS
import Home from './components/Home';
import AddTable from './components/AddTable';
import OrdersByTable from './components/OrdersByTable';
import AddProduct from './components/AddProduct';
import AddOrder from './components/AddOrder';
import AllProduct from './components/AllProduct';
import CompletedOrder from './components/CompletedOrder';
import EditProduct from './components/EditProduct';
import OrderHistory from './components/OrderHistory';

// GLOBALS
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Összes asztal',
            headerShown: false,
          }}></Stack.Screen>

        <Stack.Screen name="AddTable" component={AddTable}></Stack.Screen>

        <Stack.Screen
          name="OrdersByTable"
          component={OrdersByTable}
          options={{title: 'Asztal ?'}}></Stack.Screen>

        <Stack.Screen
          name="AddOrder"
          component={AddOrder}
          options={{title: 'Új rendelés hozzáadása (Asztal x)'}}></Stack.Screen>

        <Stack.Screen
          name="AllProduct"
          component={AllProduct}
          options={{title: 'Összes termék'}}></Stack.Screen>

        <Stack.Screen
          name="AddProduct"
          component={AddProduct}
          options={{title: 'Új termék hozzáadása'}}></Stack.Screen>

        <Stack.Screen
          name="EditProduct"
          component={EditProduct}
          options={{title: 'Termék adatainak változtatása'}}></Stack.Screen>

        <Stack.Screen
          name="OrderHistory"
          component={OrderHistory}
          options={{title: 'Rendeléstörténet'}}></Stack.Screen>

        <Stack.Screen
          name="CompletedOrder"
          component={CompletedOrder}
          options={{title: 'Rendelések ? dátum alatt'}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
