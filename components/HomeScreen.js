import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  Text,
  Button,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default HomeScreen = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tableSum, setTableSum] = useState([]);

  const isVisible = useIsFocused();

  const calculateTableSum = () => {
    let temp = new Array(items.length).fill(0);
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < orders.length; j++) {
        if (items[i].id == orders[j].localtable_id) {
          temp[i] += orders[j].huf * orders[j].amount;
        }
      }
    }
    return temp;
  };

  // SQL GET ALL ORDERS JOINED WITH PRODUCTS
  useEffect(() => {
    if (isVisible) {
      sqlQuery(
        'SELECT * FROM ORD JOIN Product on ORD.product_id = Product.id',
        setOrders,
      );

      let newTableSum = calculateTableSum();
      setTableSum(newTableSum);
    }
  }, [isVisible, items]);

  // SQL GET ALL TABLES
  useEffect(() => {
    sqlQuery('SELECT * FROM LocalTable', setItems);
  }, [isVisible]);

  const Table = ({item, onPress}) => (
    <TouchableOpacity style={styles.table} onPress={onPress}>
      <Text>{item.name}</Text>
      <Text>{tableSum[item.id - 1]} Ft</Text>
    </TouchableOpacity>
  );

  const renderTable = ({item}) => {
    return (
      <Table
        item={item}
        onPress={() => navigation.navigate('TableScreen', {id: item.id})}
      />
    );
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <FlatList
        data={items}
        renderItem={renderTable}
        keyExtractor={item => item.id}
        numColumns="2"
        contentContainerStyle={styles.tableList}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AllProductScreen')}
          style={styles.button}>
          <Text>Terméklista</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('OrderHistory')}
          style={styles.button}>
          <Text>Rendeléstörténet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    // flex: 1,
  },
  tableList: {
    // alignItems: 'center',
  },
  table: {},
  buttonContainer: {},
  button: {},
});
