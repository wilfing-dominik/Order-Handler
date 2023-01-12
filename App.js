import {React, useState, useEffect} from 'react';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SQLite from 'react-native-sqlite-storage';
import { 
  Alert,  
  StyleSheet, 
  Text, 
  View, 
  Button,  
  SafeAreaView, 
  StatusBar,
  FlatList, 
  TouchableOpacity,  
  TextInput, 
  listViewItemSeparator 
} from 'react-native';
import Papa from 'papaparse';
import { PermissionsAndroid } from 'react-native'
var RNFS = require('react-native-fs');

//GLOBALS
var db = SQLite.openDatabase({name: 'order-handler-db.db', createFromLocation: 1}, () => {
  console.log("Database OPENED");
}, (err) => {
  console.log("SQL Error: " + err);
});


const Stack = createNativeStackNavigator();
//GLOBALS END


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name = "HomeScreen"
          component={HomeScreen}
          options={{ title: 'Összes asztal' }}
        >
        </Stack.Screen>

        <Stack.Screen
          name = "TableScreen"
          component={TableScreen}
          options={{ title: 'Asztal' }}
        >
        </Stack.Screen>

        <Stack.Screen
          name = "AddProductToTableScreen"
          component={AddProductToTableScreen}
          options={{ title: 'Új tétel hozzáadása (Asztal x)' }}
        >
        </Stack.Screen>

        <Stack.Screen
          name = "AllProductScreen"
          component={AllProductScreen}
          options={{ title: 'Összes termék' }}
        >
        </Stack.Screen>

        <Stack.Screen
          name = "AddProductToInventory"
          component={AddProductToInventoryScreen}
          options={{ title: 'Teljesen új termék hozzáadása' }}
        >
        </Stack.Screen>

        <Stack.Screen
          name = "EditProductInInventory"
          component={EditProductInInventoryScreen}
          options={{ title: 'Termék adatainak változtatása' }}
        >
        </Stack.Screen>

        <Stack.Screen
          name = "OrderHistory"
          component={OrderHistoryScreen}
          options={{ title: 'Rendeléstörténet' }}
        >
        </Stack.Screen>

        <Stack.Screen
          name = "CompletedOrderScreen"
          component={CompletedOrder}
          options={{ title: 'Rendelések ? dátum alatt' }}
        >
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  )
}


//SCREENS
function HomeScreen({ navigation }) {

  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tableSum, setTableSum] = useState([]);

  const isVisible = useIsFocused();

  // SQL GET ALL ORDERS JOINED WITH PRODUCTS
  useEffect(() => {
    if(isVisible) {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM ORD JOIN Product on ORD.product_id = Product.id',
          [],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setOrders(temp);
          }
        );
      });
      
      let temp = new Array(items.length).fill(0);
      for(let i = 0; i < items.length; i++) {
        for (let j = 0; j < orders.length; j++) {
          if(items[i].id == orders[j].localtable_id) {
            temp[i] += orders[j].huf * orders[j].amount;
          }
        }
      }
      setTableSum(temp);
    }
  }, [isVisible, items]);

  // SQL GET ALL TABLES
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM LocalTable',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setItems(temp);
   
          if (results.rows.length >= 1) {
            setEmpty(false);
          } else {
            setEmpty(true)
          }
   
        }
      );
    });
  }, [isVisible]);

  const Item = ({ item, onPress, backgroundColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.HomeItem, backgroundColor]}>
      <Text style={[styles.Font, styles.Title]}>{item.name}</Text>
      <Text style={[styles.Font, styles.Title, styles.Bold]}>{tableSum[item.id-1]} Ft</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = "#66c2ff";
              
    return (
      <Item
        item={item}
        onPress={() => navigation.navigate("TableScreen", {id: item.id})}
        backgroundColor={{ backgroundColor }}
      />
      );
  };

  return (
    <SafeAreaView style={styles.HomeContainer}>
      <FlatList
            data={items}
            ItemSeparatorComponent={listViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            numColumns="2"
          />
      <View style={{ marginBottom: 8, marginTop: 8 }}><Button title="Terméklista" onPress={() => navigation.navigate("AllProductScreen")}/></View>
      <View><Button title="Rendeléstörténet" onPress={() => navigation.navigate("OrderHistory")}/></View>
    </SafeAreaView>
  );
}


function TableScreen({ navigation, route }) {
  
  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState([]);

  const isVisible = useIsFocused();

  navigation.setOptions({
    title: `Asztal ` + route.params.id,
  })

  useEffect(() => {
    if (isVisible) {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM ORD JOIN Product ON ORD.product_id=Product.id WHERE localtable_id=?;',
          [route.params.id],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setItems(temp);
   
            if (results.rows.length >= 1) {
              setEmpty(false);
            } else {
              setEmpty(true)
            }
   
          }
        );
      });
    }
  }, [isVisible, items]);

  function handleTablePay(localTableId) {
    
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    for(let i = 0; i < items.length; i++) {
      for(let j = 0; j < items[i].amount; j++) {
        db.transaction((tx) => {
          tx.executeSql(
            'INSERT INTO CompletedOrder (product_name, order_date) VALUES (?,?)',
            [items[i].name, year + '-' + month + '-' + date],
            (tx, results) => {
            }
          );
        });
      }
    }

    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM ORD WHERE localtable_id=?;',
        [localTableId],
        (tx, results) => {
        }
      );
    });
    alert('Fizetve!');
    navigation.navigate("HomeScreen")
  }

  function deleteOrder(orderId, amount) { // TODO
    if(amount > 1) {
      db.transaction(function (tx) {
        tx.executeSql(
          'UPDATE ORD SET amount=? WHERE localtable_id=? AND product_id=?',
          [amount-1, route.params.id, orderId],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              //Alert.alert('Rendelés hozzáadva: ' + productName);
            } 
            else Alert.alert('Sikertelen hozzáadás');
          }
        );
      });
    }
    else{
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM ORD WHERE product_id=?;',
          [orderId],
          (tx, results) => {
          }
        );
      });
      // navigation.navigate("HomeScreen")
    }
    }
  
  const renderTableItem = ({ item }) => {
    return (
        <View style={styles.TableItem}>
          <Text style={styles.Bold}>{item.name}</Text>
          <Text><Text style={styles.Bold}>{item.eur}</Text> Eur </Text>
          <Text><Text style={styles.Bold}>{item.huf}</Text> Huf</Text>
          <Text><Text style={styles.Bold}>{item.amount}</Text> DB</Text>
          <TouchableOpacity
            onPress={() => deleteOrder(item.id, item.amount)}
          >
            <Text style={{ backgroundColor: "red", padding: 5, fontWeight: "bold" ,textAlign:"center"}}>Törlés {"\n"} (-1)</Text>
          </TouchableOpacity>
        </View>
      );
  };

  return (
    <View style={styles.TableScreenContainer}>
      <View style={styles.TableListContainer}>
        <Text style={[styles.Font, styles.TableSum]}>
          Teljes összeg: 
          <Text style={[styles.TableSum, styles.Bold, styles.TableSum]}>
            {items.reduce((a,v) =>  a = a + v.huf*v.amount, 0)} HUF | {items.reduce((a,v) =>  a = a + v.eur*v.amount, 0)} EUR
          </Text>
        </Text>
        <FlatList
          data={items}
          renderItem={renderTableItem}
          keyExtractor={tableItems => tableItems.id}
          numColumns={1}
        />
      </View>
      <View style={styles.TableButtonsContainer}>
      <Button
        title="Új tétel"
        onPress={() => navigation.navigate("AddProductToTableScreen", {tableId: route.params.id})}
      />
      <Button
        title="Fizetett"
        onPress={() => handleTablePay(route.params.id)}
      />
    </View>
  </View>
  );
}


function AddProductToTableScreen({ navigation, route }) {

  const [products, setProducts] = useState([]);
  const [empty, setEmpty] = useState([]);
  const [newAmount, setNewAmount] = useState(1);
  const [orders, setOrders] = useState([]);

  
  navigation.setOptions({
    title: 'Új tétel hozzáadása (Asztal ' + route.params.tableId + ')',
  })

  function handlePressIncreaseAmount() {
    if(newAmount+1 <= 99)
      setNewAmount(newAmount+1)
  }

  function handlePressDecreaseAmount() {
    if(newAmount-1 > 0)
      setNewAmount(newAmount-1)
    }

  //SQL GET ALL PRODUCTS
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Product',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setProducts(temp);
 
          if (results.rows.length >= 1) {
            setEmpty(false);
          } else {
            setEmpty(true)
          }
 
        }
      );
    });
  }, []);

  //SQL GET ALL ORDERS
  useEffect(() => {
    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM ORD',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setOrders(temp);
        }
      );
    });
  }, []);

  function HandleAddProductToTableButton(productId, localTableId, newAmount) {
    isAlreadyAdded = false;
    oldAmount = 0
    for (let i = 0; i < orders.length; ++i) {
      if (orders[i].product_id == productId && orders[i].localtable_id == localTableId) {
        isAlreadyAdded = true;
        oldAmount = orders[i].amount;
      }
    }

    if (!isAlreadyAdded) {
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO ORD (localtable_id, product_id, amount) VALUES (?,?,?)',
          [localTableId, productId, newAmount],
          (tx, results) => {

          }
        );
      });
    }
    else {
      db.transaction(function (tx) {
        tx.executeSql(
          'UPDATE ORD SET amount=? WHERE localtable_id=? AND product_id=?',
          [parseInt(oldAmount + newAmount, 10), localTableId, productId],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Rendelés hozzáadva: ' + productName);
            } 
            else Alert.alert('Sikertelen hozzáadás');
          }
        );
      });
    }
    navigation.navigate('TableScreen', {id: route.params.tableId});
  }

  const ProductItem = ({ item, onPress, backgroundColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.HomeItem, backgroundColor]}>
      <Text style={[styles.Title]}>{item.name}</Text>
      <Text style={[styles.Title, styles.Bold]}>{item.huf} Huf</Text>
      <Text style={[styles.Title, styles.Bold]}>{item.eur} Eur</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => {
    const backgroundColor = "#66c2ff";
    const color = 'black';
              
    return (
      <ProductItem
        item={item}
        backgroundColor={{ backgroundColor }}
        onPress= { () => HandleAddProductToTableButton(item.id, route.params.tableId, newAmount) }
      />
      );
  };

  return (
    <SafeAreaView style={styles.AddProductToTableContainer}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
      />

      <Text style={styles.Font}>Darab: {newAmount}</Text>
      <View style={styles.amountChangerContainer}>
        <TouchableOpacity 
          onPress={() => handlePressDecreaseAmount()}
          style={ styles.amountButton }>
          <Text style={{ fontSize:25 }}>-</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => handlePressIncreaseAmount()}
          style={ styles.amountButton }>
          <Text style={{ fontSize:25 }} >+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


function AllProductScreen({ navigation }) {

  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState([]);

  const isVisible = useIsFocused();

    // SQL QUERY
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Product',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setItems(temp);
   
          if (results.rows.length >= 1) {
            setEmpty(false);
          } else {
            setEmpty(true)
          }
        }
      );
    });
  }, [isVisible]);

  const renderAllProductItem = ({ item }) => {
    const backgroundColor = "#66c2ff";
              
    return (
      <TouchableOpacity 
        onPress={ () => navigation.navigate('EditProductInInventory', {id: item.id, name: item.name, eur: item.eur, huf: item.huf})} 
        style={[styles.AllProductItem, backgroundColor]}>
        <Text style={[styles.Font, styles.Title]}>{item.name} {item.huf} Huf {item.eur} EUR</Text>
    </TouchableOpacity>
      );
  };

  return (
    <View style={styles.AllProductContainer}>
      <SafeAreaView style={styles.AllProductListContainer}>
        <FlatList
          numColumns={1}
          keyExtractor={item => item.id}
          data={items}
          renderItem={renderAllProductItem}
        />
      </SafeAreaView>
      <Button
        title= 'Új termék hozzáadása'
        onPress={() => navigation.navigate('AddProductToInventory')}
      />
    </View>
  );
}


function AddProductToInventoryScreen({ navigation }) {

  const [productName, setProductName] = useState('');
  const [productEur, setProductEur] = useState('');
  const [productHuf, setProductHuf] = useState('');

  function isNumber(str) {
    if (str.trim() === '') {
      return false;
    }
  
    return !isNaN(str);
  }

  function handleAddProductToInventory() {
    if(productName.length < 3 || !isNumber(productHuf) || !isNumber(productEur)) {
      alert("A megadott adatok nem megfelelőek! \nTermék név min. 3 BETŰ, az áraknak pedig SZÁMNAK kell lennie!");
    }
    else {
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO Product (name, eur, huf) VALUES (?,?,?)',
          [productName, productEur, productHuf],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Termék hozzáadva: ' + productName);
            } 
            else Alert.alert('Sikertelen hozzáadás');
          }
        );
      });
    }
    navigation.navigate('AllProductScreen');
  }

  return (
    <View style={styles.AddProductToInventoryScreen}>
      <View>
        <TextInput placeholder='Termék név' placeholderTextColor='#2b2b28' style={[styles.Font, styles.Input]} onChangeText={ (productName)=>setProductName(productName) }></TextInput>
        <TextInput placeholder='Ár euróban' placeholderTextColor='#2b2b28' style={[styles.Font, styles.Input]} onChangeText={ (productEur)=>setProductEur(productEur) }></TextInput>
        <TextInput placeholder='Ár forintban' placeholderTextColor='#2b2b28' style={[styles.Font, styles.Input]} onChangeText={ (productHuf)=>setProductHuf(productHuf) }></TextInput>
      </View>
      <Button
        title="Hozzáadás"
        onPress={() => handleAddProductToInventory()}
      />
    </View>
  );
}


function EditProductInInventoryScreen({navigation, route}) {

  const [productName, setProductName] = useState('');
  const [productEur, setProductEur] = useState('');
  const [productHuf, setProductHuf] = useState('');

  function isNumber(str) {
    if (str.trim() === '') {
      return false;
    }
  }

  function handleDeleteItem(productId) {
    db.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM Product WHERE id=?;',
        [productId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Termék törölve: ' + productName);
          } 
          else Alert.alert('Sikertelen törlés');
        }
      );
    });
    navigation.navigate('AllProductScreen')
  }

  function handleEditItem(productId, productName, productEur, productHuf) {
    if(productName.length < 3 || !isNumber(productHuf) || !isNumber(productEur)) {
      alert("A megadott adatok nem megfelelőek! \nTermék név min. 3 BETŰ, az áraknak pedig SZÁMNAK kell lennie!");
    }
    else {
      db.transaction(function (tx) {
        tx.executeSql(
          'UPDATE Product SET name=?, eur=?, huf=? WHERE id=?',
          [productName, productEur, productHuf, productId],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Termék módosítva: ' + productName);
            } 
            else Alert.alert('Sikertelen módosítás');
          }
        );
      });
      navigation.navigate('HomeScreen');
    }
  }

  return (
    <View>
      <Text style={styles.Font}>Termék azonosító: {route.params.id}</Text>

      <Text style={styles.Font}>Név:</Text>
      <TextInput
        style={styles.Font} 
        onChangeText={ (productName)=>setProductName(productName) }
        placeholder = {route.params.name}
        placeholderTextColor='#2b2b28'
        >
      </TextInput>

      <Text style={styles.Font}>Forint:</Text>
      <TextInput
        style={styles.Font}
        onChangeText={ (productHuf)=>setProductHuf(productHuf) }
        placeholder = {String(route.params.huf)}
        placeholderTextColor='#2b2b28'
        >
      </TextInput>

      <Text style={styles.Font}>Euró:</Text>
      <TextInput
        style={styles.Font} 
        onChangeText={ (productEur)=>setProductEur(productEur) }
        placeholder = {String(route.params.eur)}
        placeholderTextColor='#2b2b28'
        >
      </TextInput>

      <Button 
        title="Adatok módosítása"
        onPress={() => handleEditItem(route.params.id, productName, productEur, productHuf)}
      />
      <Button 
        title="Termék törlése"
        onPress={() => handleDeleteItem(route.params.id)}
      />
    </View>
  );
}


function OrderHistoryScreen({navigation}) {

  const [distinctDates, setDistinctDates] = useState([]);

  const isVisible = useIsFocused();

  //SQL GET ALL distinct dates 
  useEffect(() => {
    if(isVisible) {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT DISTINCT order_date FROM CompletedOrder ORDER BY order_date',
          [],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setDistinctDates(temp);
          }
        );
      });
    }
  }, [isVisible]); 

  const renderOrderItem = ({ item }) => {

    return (
          <TouchableOpacity
            style={styles.TableItem}
            onPress={() => navigation.navigate("CompletedOrderScreen", {date: item.order_date})}
          >
            <Text
              style={{fontWeight: 'bold', fontSize: 18}}
            >
              {item.order_date}
            </Text>


          </TouchableOpacity>   
    );
  };

  return(
    <View>
      <FlatList
        data={distinctDates}
        renderItem={renderOrderItem}
        keyExtractor={orderDates => orderDates.id}
        numColumns={1}
        />
    </View>
  );
}


function CompletedOrder({navigation, route}) {
  
  const [completedOrders, setCompletedOrders] = useState([]);

  navigation.setOptions({
    title: route.params.date + ' fizetett rendelései',
  })

  let isVisible = useIsFocused();

   //SQL GET ALL completed orders 
   useEffect(() => {
    if(isVisible) {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM CompletedOrder WHERE order_date=?',
          [route.params.date],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setCompletedOrders(temp);
          }
        );
      });
    }
  }, [isVisible, completedOrders]);

  const handleClick = async () => {

    try{
      // Check for Permission (check if permission is already given or not)
      let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

      if(!isPermitedExternalStorage){

        // Ask for permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage permission needed",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );

        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted (calling our exportDataToExcel function)
          toCSV();
          console.log("Permission granted");
        } else {
          // Permission denied
          console.log("Permission denied");
        }
      }else{
         // Already have Permission (calling our exportDataToExcel function)
         toCSV();
      }
    }catch(e){
      console.log('Error while checking permission');
      console.log(e);
      return
    }
    
  };

  function toCSV() {
    
    let new_data = Papa.unparse(completedOrders);

    //WRITE
    // create a path you want to write to
    // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    var path = RNFS.DownloadDirectoryPath + '/' + route.params.date + '.csv';

    // write the file
    RNFS.writeFile(path, new_data, 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN!');
    })
    .catch((err) => {
      console.log(err.message);
    });

    //READ
    // get a list of files and directories in the main bundle
    RNFS.readDir(RNFS.DownloadDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then((result) => {
      //console.log('GOT RESULT', result);

      // stat the first file
      return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    })
    .then((statResult) => {
      if (statResult[0].isFile()) {
        // if we have a file, read it
        return RNFS.readFile(statResult[1], 'utf8');
      }

      return 'no file';
    })
    .then((contents) => {
      // log the file contents
      console.log(contents);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
  }

  function deleteCompletedOrder(cOrderId) {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM CompletedOrder WHERE id=?;',
        [cOrderId],
        (tx, results) => {
        }
      );
    });
  }

  const renderOrderItem = ({ item }) => {

    return (
      <View style={styles.TableItem}>
        <Text style={styles.Bold}>{item.product_name}</Text>
        <Text>Fizetés dátuma: <Text style={styles.Bold}>{item.order_date}</Text></Text>
        <TouchableOpacity
          onPress={() => deleteCompletedOrder(item.id)}
        >
          <Text
            style={{ backgroundColor: "red", padding: 5, fontWeight: "bold" ,textAlign:"center"}}
          >
            Törlés
          </Text>
        </TouchableOpacity>
        </View>
    );
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => handleClick()}
        style={{ backgroundColor: 'yellow', padding: 5, maxWidth: 60, textAlign: 'center', margin: 8}}
      >
        <Text>Export</Text>
      </TouchableOpacity>
      <FlatList
        data={completedOrders}
        renderItem={renderOrderItem}
        keyExtractor={orderItem => orderItem.id}
        numColumns={1}
      />
    </View>
  );
}
//SCREENS END


//STYLES
const styles = StyleSheet.create({  
  Font: {
    color: "#2b2b28",
    fontSize: 14,
  }, 
  Bold: {
    fontWeight: 'bold',
  },
  Input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  HomeContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
    marginBottom: StatusBar.currentHeight || 0,
  },
  HomeItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 125,
    minHeight: 70,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  Hometitle: {
    fontSize: 32,
  },

  TableScreenContainer: {
    flex: 1,
  },
  TableListContainer: {
    flex: 1,
    ColumnsNum: 1,
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  TableItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#66c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    minWidth: 300  
  },
  TableButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 36,
    maxWidth: 420,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  TableSum: {
    fontSize: 18,
  },

  AddProductToTableContainer: {
    flex: 1,
    ColumnsNum: 1,
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
    marginBottom: StatusBar.currentHeight || 0,
  },
  amountChangerContainer: {
    flex: -4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountButton: {
    textAlign: 'center',
    margin: 30,
    backgroundColor: '#66c2ff',
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 8,
  },


  AllProductContainer: {
    flex: 1,
    
  },
  AllProductListContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  AllProductItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: "#66c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  AddProductToInventoryScreen: {
    flex: 1,
    justifyContent: 'space-between',
  }
});
//STYLES END

export default App