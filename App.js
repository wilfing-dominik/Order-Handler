import React, {useState, useEffect, createContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import './styles/style';

//COMPONENTS
import Home from './components/Home';
import OrdersByTable from './components/OrdersByTable';
import AddProduct from './components/AddProduct';
import AddOrder from './components/AddOrder';
import AllProduct from './components/AllProduct';
import CompletedOrder from './components/CompletedOrder';
import EditProduct from './components/EditProduct';
import OrderHistory from './components/OrderHistory';
import MainSettings from './components/MainSettings';
import {sqlQuery} from './utils/dbConnection';

// GLOBALS
const Stack = createNativeStackNavigator();
export const mainSettingsContext = createContext();
export const updateMainSettingsContext = createContext();

const App = () => {
  const [mainSettings, setMainSettings] = useState([]);
  const [updateMainSettings, setUpdateMainSettings] = useState(false);

  useEffect(() => {
    sqlQuery('SELECT * FROM MainSettings', setMainSettings);
    setUpdateMainSettings(false);
  }, [updateMainSettings]);

  return (
    <updateMainSettingsContext.Provider
      value={[updateMainSettings, setUpdateMainSettings]}>
      <mainSettingsContext.Provider value={mainSettings}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="MainSettings"
              component={MainSettings}
              options={{
                headerTitle: 'Beállítások',
                headerStyle: {
                  backgroundColor: '#2b2b28',
                },
                headerTitleStyle: {color: 'white'},
                headerTintColor: 'white',
              }}
            />

            <Stack.Screen
              name="OrdersByTable"
              component={OrdersByTable}
              options={{
                title: 'Asztal ?',
                headerStyle: {
                  backgroundColor: '#2b2b28',
                },
                headerTitleStyle: {color: 'white'},
                headerTintColor: 'white',
              }}
            />

            <Stack.Screen
              name="AddOrder"
              component={AddOrder}
              options={{
                title: 'Új rendelés hozzáadása (Asztal x)',
                headerStyle: {
                  backgroundColor: '#2b2b28',
                },
                headerTitleStyle: {color: 'white'},
                headerTintColor: 'white',
              }}
            />

            <Stack.Screen
              name="AllProduct"
              component={AllProduct}
              options={{
                title: 'Összes termék',
                headerStyle: {
                  backgroundColor: '#2b2b28',
                },
                headerTitleStyle: {color: 'white'},
                headerTintColor: 'white',
              }}
            />

            <Stack.Screen
              name="AddProduct"
              component={AddProduct}
              options={{
                title: 'Új termék hozzáadása',
                headerStyle: {
                  backgroundColor: '#2b2b28',
                },
                headerTitleStyle: {color: 'white'},
                headerTintColor: 'white',
              }}
            />

            <Stack.Screen
              name="EditProduct"
              component={EditProduct}
              options={{
                title: 'Termék adatainak változtatása',
                headerStyle: {
                  backgroundColor: '#2b2b28',
                },
                headerTitleStyle: {color: 'white'},
                headerTintColor: 'white',
              }}
            />

            <Stack.Screen
              name="OrderHistory"
              component={OrderHistory}
              options={{
                title: 'Rendeléstörténet',
                headerStyle: {
                  backgroundColor: '#2b2b28',
                },
                headerTitleStyle: {color: 'white'},
                headerTintColor: 'white',
              }}
            />

            <Stack.Screen
              name="CompletedOrder"
              component={CompletedOrder}
              options={{
                title: 'Rendelések ? dátum alatt',
                headerStyle: {
                  backgroundColor: '#2b2b28',
                },
                headerTitleStyle: {color: 'white'},
                headerTintColor: 'white',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </mainSettingsContext.Provider>
    </updateMainSettingsContext.Provider>
  );
};

export default App;
