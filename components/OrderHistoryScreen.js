import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default OrderHistoryScreen = ({navigation}) => {
  const [distinctDates, setDistinctDates] = useState([]);

  const isVisible = useIsFocused();

  //SQL GET ALL distinct dates
  useEffect(() => {
    if (isVisible) {
      sqlQuery(
        'SELECT DISTINCT order_date FROM CompletedOrder ORDER BY order_date',
        setDistinctDates,
      );
    }
  }, [isVisible]);

  const renderOrder = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.TableItem}
        onPress={() =>
          navigation.navigate('CompletedOrderScreen', {date: item.order_date})
        }>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>
          {item.order_date}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={distinctDates}
        renderItem={renderOrder}
        keyExtractor={item => item.order_date}
        numColumns="1"
      />
    </View>
  );
};
