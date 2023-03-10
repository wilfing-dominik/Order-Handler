import React, {useState, useEffect, useContext} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  Text,
  View,
  Button,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';
import {mainSettingsContext} from '../App';

export default AllProduct = ({navigation}) => {
  const [items, setItems] = useState([]);
  const mainSettings = useContext(mainSettingsContext);

  const isVisible = useIsFocused();

  useEffect(() => {
    sqlQuery('SELECT * FROM Product', setItems);
  }, [isVisible]);

  const ProductItem = ({item}) => {
    const backgroundColor = '#66c2ff';

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('EditProduct', {
            id: item.id,
            name: item.name,
            main_price: item.main_price,
          })
        }
        style={[styles.AllProductItem, backgroundColor]}>
        <Text style={[styles.Font, styles.Title]}>
          {item.name} {item.main_price} {mainSettings[1]?.value}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProductItem = ({item}) => {
    return <ProductItem item={item} />;
  };

  return (
    <View style={styles.AllProductContainer}>
      <SafeAreaView style={styles.AllProductListContainer}>
        <FlatList
          numColumns={1}
          keyExtractor={item => item.id}
          data={items}
          renderItem={renderProductItem}
        />
      </SafeAreaView>
      <Button
        title="Új termék hozzáadása"
        onPress={() => navigation.navigate('AddProduct')}
      />
    </View>
  );
};
