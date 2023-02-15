import React, {useState} from 'react';
import {View, Button, TextInput, Alert} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default AddProduct = ({navigation}) => {
  const [productName, setProductName] = useState('');
  const [productEur, setProductEur] = useState('');
  const [productHuf, setProductHuf] = useState('');

  let placeholderTextColor = '#2b2b28';

  function isNumber(str) {
    if (str.trim() === '') {
      return false;
    }

    return !isNaN(str);
  }

  function handleAddProductToInventory() {
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
        'INSERT INTO Product (name, eur, huf) VALUES (?,?,?)',
        null,
        productName,
        productEur,
        productHuf,
      );
      navigation.navigate('AllProductScreen');
    }
  }

  return (
    <View style={styles.AddProductToInventoryScreen}>
      <View>
        <TextInput
          placeholder="Termék név"
          placeholderTextColor={placeholderTextColor}
          style={[styles.Font, styles.Input]}
          onChangeText={productName => setProductName(productName)}></TextInput>
        <TextInput
          placeholder="Ár euróban"
          placeholderTextColor={placeholderTextColor}
          style={[styles.Font, styles.Input]}
          onChangeText={productEur => setProductEur(productEur)}></TextInput>

        <TextInput
          placeholder="Ár forintban"
          placeholderTextColor={placeholderTextColor}
          style={[styles.Font, styles.Input]}
          onChangeText={productHuf => setProductHuf(productHuf)}></TextInput>
      </View>

      <Button title="Hozzáadás" onPress={() => handleAddProductToInventory()} />
    </View>
  );
};
