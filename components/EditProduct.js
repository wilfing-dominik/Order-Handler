import React, {useState} from 'react';
import {Text, View, Button, TextInput, Alert} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default EditProduct = ({navigation, route}) => {
  const [productName, setProductName] = useState('');
  const [productMainPrice, setProductMainPrice] = useState('');

  function isNumber(str) {
    if (str.trim() === '') {
      return false;
    }
    return true;
  }

  function handleDeleteItem(productId) {
    +sqlQuery('DELETE FROM Product WHERE id=?;', null, productId);
    navigation.navigate('AllProduct');
  }

  function handleEditItem(productId, productName, productMainPrice) {
    if (productName.length < 3 || !isNumber(productMainPrice)) {
      Alert.alert(
        'A megadott adatok nem megfelelőek!',
        '\n- Termék név min. 3 BETŰ \n\n- Az áraknak SZÁMNAK kell lennie!',
      );
    } else {
      sqlQuery(
        'UPDATE Product SET name=?, main_price=? WHERE id=?',
        null,
        productName,
        productMainPrice,
        productId,
      );
      navigation.navigate('Home');
    }
  }

  return (
    <View>
      <Text style={styles.Font}>Termék azonosító: {route.params.id}</Text>

      <Text style={styles.Font}>Név:</Text>
      <TextInput
        style={styles.Font}
        onChangeText={productName => setProductName(productName)}
        placeholder={route.params.name}
        placeholderTextColor="#2b2b28"
      />

      <Text style={styles.Font}>Forint:</Text>
      <TextInput
        style={styles.Font}
        onChangeText={productMainPrice => setProductMainPrice(productMainPrice)}
        placeholder={String(route.params.main_price)}
        placeholderTextColor="#2b2b28"
      />

      {/* <Text style={styles.Font}>Euró:</Text>
      <TextInput
        style={styles.Font}
        onChangeText={productEur => setProductEur(productEur)}
        placeholder={String(route.params.eur)}
        placeholderTextColor="#2b2b28"
      /> */}

      <Button
        title="Adatok módosítása"
        onPress={() =>
          handleEditItem(route.params.id, productName, productMainPrice)
        }
      />
      <Button
        title="Termék törlése"
        onPress={() => handleDeleteItem(route.params.id)}
      />
    </View>
  );
};
