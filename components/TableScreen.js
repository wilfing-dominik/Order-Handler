import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Text, View, Button, FlatList, TouchableOpacity} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default TableScreen = ({navigation, route}) => {
  const [items, setItems] = useState([]);

  const isVisible = useIsFocused();

  navigation.setOptions({
    title: `Asztal ` + route.params.id,
  });

  useEffect(() => {
    if (isVisible) {
      let tableId = route.params.id;
      sqlQuery(
        'SELECT * FROM ORD JOIN Product ON ORD.product_id=Product.id WHERE localtable_id=?;',
        setItems,
        tableId,
      );
    }
  }, [isVisible, items]);

  function handleTablePay(localTableId) {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items[i].amount; j++) {
        sqlQuery(
          'INSERT INTO CompletedOrder (product_name, order_date, HUF, EUR) VALUES (?,?,?,?)',
          null,
          items[i].name,
          year + '-' + month + '-' + date,
          parseInt(items[i].huf, 10),
          parseInt(items[i].eur, 10),
        );
      }
    }

    sqlQuery('DELETE FROM ORD WHERE localtable_id=?;', null, localTableId);
    alert('Fizetve!');
    navigation.navigate('HomeScreen');
  }

  function deleteOrder(orderId, amount) {
    // TODO
    if (amount > 1) {
      sqlQuery(
        'UPDATE ORD SET amount=? WHERE localtable_id=? AND product_id=?',
        null,
        amount - 1,
        route.params.id,
        orderId,
      );
    } else {
      sqlQuery('DELETE FROM ORD WHERE product_id=?;', null, orderId);
      // navigation.navigate("HomeScreen")
    }
  }

  const renderTableItem = ({item}) => {
    return (
      <View style={styles.TableItem}>
        <Text style={styles.Bold}>{item.name}</Text>
        <Text>
          <Text style={styles.Bold}>{item.eur}</Text> Eur{' '}
        </Text>
        <Text>
          <Text style={styles.Bold}>{item.huf}</Text> Huf
        </Text>
        <Text>
          <Text style={styles.Bold}>{item.amount}</Text> DB
        </Text>
        <TouchableOpacity onPress={() => deleteOrder(item.id, item.amount)}>
          <Text
            style={{
              backgroundColor: 'red',
              padding: 5,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Törlés {'\n'} (-1)
          </Text>
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
            {items.reduce((a, v) => (a = a + v.huf * v.amount), 0)} HUF |{' '}
            {items.reduce((a, v) => (a = a + v.eur * v.amount), 0)} EUR
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
          onPress={() =>
            navigation.navigate('AddProductToTableScreen', {
              tableId: route.params.id,
            })
          }
        />
        <Button
          title="Fizetett"
          onPress={() => handleTablePay(route.params.id)}
        />
      </View>
    </View>
  );
};
