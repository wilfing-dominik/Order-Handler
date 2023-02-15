import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default AddOrder = ({navigation, route}) => {
  const [products, setProducts] = useState([]);
  const [newAmount, setNewAmount] = useState(1);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Új tétel hozzáadása (Asztal ' + route.params.tableId + ')',
    });
  });

  function handlePressIncreaseAmount() {
    if (newAmount + 1 <= 99) setNewAmount(newAmount + 1);
  }

  function handlePressDecreaseAmount() {
    if (newAmount - 1 > 0) setNewAmount(newAmount - 1);
  }

  //SQL GET ALL PRODUCTS
  useEffect(() => {
    sqlQuery('SELECT * FROM Product', setProducts);
  }, []);

  //SQL GET ALL ORDERS
  useEffect(() => {
    sqlQuery('SELECT * FROM ORD', setOrders);
  }, []);

  function HandleAddProductToTableButton(productId, localTableId, newAmount) {
    isAlreadyAdded = false;
    oldAmount = 0;
    for (let i = 0; i < orders.length; ++i) {
      if (
        orders[i].product_id == productId &&
        orders[i].localtable_id == localTableId
      ) {
        isAlreadyAdded = true;
        oldAmount = orders[i].amount;
      }
    }

    if (!isAlreadyAdded) {
      sqlQuery(
        'INSERT INTO ORD (localtable_id, product_id, amount) VALUES (?,?,?)',
        null,
        localTableId,
        productId,
        newAmount,
      );
    } else {
      sqlQuery(
        'UPDATE ORD SET amount=? WHERE localtable_id=? AND product_id=?',
        null,
        parseInt(oldAmount + newAmount, 10),
        localTableId,
        productId,
      );
    }
    navigation.navigate('TableScreen', {id: route.params.tableId});
  }

  const ProductItem = ({item, onPress, backgroundColor}) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.HomeItem, backgroundColor]}>
      <Text style={[styles.Title]}>{item.name}</Text>
      <Text style={[styles.Title, styles.Bold]}>{item.huf} Huf</Text>
      <Text style={[styles.Title, styles.Bold]}>{item.eur} Eur</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({item}) => {
    const backgroundColor = '#66c2ff';

    return (
      <ProductItem
        item={item}
        backgroundColor={{backgroundColor}}
        onPress={() =>
          HandleAddProductToTableButton(
            item.id,
            route.params.tableId,
            newAmount,
          )
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.AddProductToTableContainer}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns="2"
      />

      <Text style={styles.Font}>Darab: {newAmount}</Text>
      <View style={styles.amountChangerContainer}>
        <TouchableOpacity
          onPress={() => handlePressDecreaseAmount()}
          style={styles.amountButton}>
          <Text style={{fontSize: 25}}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePressIncreaseAmount()}
          style={styles.amountButton}>
          <Text style={{fontSize: 25}}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
