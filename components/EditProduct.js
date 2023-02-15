import React, {useState} from 'react';
import {Text, View, Button, TextInput, Alert} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default EditProduct = ({navigation, route}) => {
  const [productName, setProductName] = useState('');
  const [productEur, setProductEur] = useState('');
  const [productHuf, setProductHuf] = useState('');

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

  function handleEditItem(productId, productName, productEur, productHuf) {
    if (
      productName.length < 3 ||
      !isNumber(productHuf) ||
      !isNumber(productEur)
    ) {
      Alert.alert(
        'A megadott adatok nem megfelelőek!',
        '\n- Termék név min. 3 BETŰ \n\n- Az áraknak SZÁMNAK kell lennie!',
      );
    } else {
      sqlQuery(
        'UPDATE Product SET name=?, eur=?, huf=? WHERE id=?',
        null,
        productName,
        productEur,
        productHuf,
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
        placeholderTextColor="#2b2b28"></TextInput>

      <Text style={styles.Font}>Forint:</Text>
      <TextInput
        style={styles.Font}
        onChangeText={productHuf => setProductHuf(productHuf)}
        placeholder={String(route.params.huf)}
        placeholderTextColor="#2b2b28"></TextInput>

      <Text style={styles.Font}>Euró:</Text>
      <TextInput
        style={styles.Font}
        onChangeText={productEur => setProductEur(productEur)}
        placeholder={String(route.params.eur)}
        placeholderTextColor="#2b2b28"></TextInput>

      <Button
        title="Adatok módosítása"
        onPress={() =>
          handleEditItem(route.params.id, productName, productEur, productHuf)
        }
      />
      <Button
        title="Termék törlése"
        onPress={() => handleDeleteItem(route.params.id)}
      />
    </View>
  );
};
