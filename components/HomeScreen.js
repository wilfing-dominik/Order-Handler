import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  Text,
  View,
  Button,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  listViewItemSeparator,
} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default HomeScreen = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tableSum, setTableSum] = useState([]);

  const isVisible = useIsFocused();

  // SQL GET ALL ORDERS JOINED WITH PRODUCTS
  useEffect(() => {
    if (isVisible) {
      sqlQuery(
        'SELECT * FROM ORD JOIN Product on ORD.product_id = Product.id',
        setOrders,
      );

      let temp = new Array(items.length).fill(0);
      for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < orders.length; j++) {
          if (items[i].id == orders[j].localtable_id) {
            temp[i] += orders[j].huf * orders[j].amount;
          }
        }
      }
      setTableSum(temp);
    }
  }, [isVisible, items]);

  // SQL GET ALL TABLES
  useEffect(() => {
    sqlQuery('SELECT * FROM LocalTable', setItems);
  }, [isVisible]);

  const Item = ({item, onPress, backgroundColor}) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.HomeItem, backgroundColor]}>
      <Text style={[styles.Font, styles.Title]}>{item.name}</Text>
      <Text style={[styles.Font, styles.Title, styles.Bold]}>
        {tableSum[item.id - 1]} Ft
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    const backgroundColor = '#66c2ff';

    return (
      <Item
        item={item}
        onPress={() => navigation.navigate('TableScreen', {id: item.id})}
        backgroundColor={{backgroundColor}}
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
      <View style={{marginBottom: 8, marginTop: 8}}>
        <Button
          title="Terméklista"
          onPress={() => navigation.navigate('AllProductScreen')}
        />
      </View>
      <View>
        <Button
          title="Rendeléstörténet"
          onPress={() => navigation.navigate('OrderHistory')}
        />
      </View>
    </SafeAreaView>
  );
};
