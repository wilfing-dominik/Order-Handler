import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Text, View, Button, FlatList, TouchableOpacity} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default OrdersByTable = ({navigation, route}) => {
  const [orders, setOrders] = useState([]);

  const isVisible = useIsFocused();

  // Update screen title with table number
  useEffect(() => {
    navigation.setOptions({
      title: route.params.name,
    });
  });

  useEffect(() => {
    if (isVisible) {
      let tableId = route.params.id;
      sqlQuery(
        'SELECT * FROM ORD JOIN Product ON ORD.product_id=Product.id WHERE localtable_id=?;',
        setOrders,
        tableId,
      );
    }
  }, [isVisible, orders]);

  function handleTablePay(localTableId) {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].amount; j++) {
        sqlQuery(
          'INSERT INTO CompletedOrder (product_name, order_date, main_price) VALUES (?,?,?)',
          null,
          orders[i].name,
          year + '-' + month + '-' + date,
          parseInt(orders[i].main_price, 10),
        );
      }
    }

    sqlQuery('DELETE FROM ORD WHERE localtable_id=?;', null, localTableId);
    navigation.navigate('Home');
  }

  function deleteOrder(orderId, amount) {
    if (amount > 1) {
      let tableId = route.params.id;
      sqlQuery(
        'UPDATE ORD SET amount=? WHERE localtable_id=? AND product_id=?',
        null,
        amount - 1,
        tableId,
        orderId,
      );
    } else {
      sqlQuery('DELETE FROM ORD WHERE product_id=?;', null, orderId);
    }
  }

  const renderTableItem = ({item: order}) => {
    return (
      <View style={styles.TableItem}>
        <Text style={styles.Bold}>{order.name}</Text>

        <Text>
          <Text style={styles.Bold}>{order.main_price}</Text> ?
        </Text>
        <Text>
          <Text style={styles.Bold}>{order.amount}</Text> DB
        </Text>
        <TouchableOpacity onPress={() => deleteOrder(order.id, order.amount)}>
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
            {orders.reduce((a, v) => (a = a + v.main_price * v.amount), 0)} ?
          </Text>
        </Text>
        <FlatList
          data={orders}
          renderItem={renderTableItem}
          keyExtractor={order => order.id}
          numColumns={1}
        />
      </View>
      <View style={styles.TableButtonsContainer}>
        <Button
          title="Új tétel"
          onPress={() =>
            navigation.navigate('AddOrder', {
              name: route.params.name,
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
