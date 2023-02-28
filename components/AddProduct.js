import React, {useState} from 'react';
import {View, Button, TextInput, Alert} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default AddProduct = ({navigation}) => {
  const [productName, setProductName] = useState('');
  const [mainPrice, setMainPrice] = useState('');

  let placeholderTextColor = '#2b2b28';

  function isNumber(str) {
    if (str.trim() === '') {
      return false;
    }

    return !isNaN(str);
  }

  function handleAddProductToInventory() {
    if (productName.length < 3 || !isNumber(mainPrice)) {
      Alert.alert(
        'A megadott adatok nem megfelelőek!',
        '\n- Termék név min. 3 BETŰ \n\n- Az áraknak SZÁMNAK kell lennie!',
      );
    } else {
      sqlQuery(
        'INSERT INTO Product (name, main_price) VALUES (?,?)',
        null,
        productName,
        mainPrice,
      );
      navigation.navigate('AllProduct');
    }
  }

  return (
    <View style={styles.AddProductToInventoryScreen}>
      <View>
        <TextInput
          placeholder="Termék név"
          placeholderTextColor={placeholderTextColor}
          style={[styles.Font, styles.Input]}
          onChangeText={productName => setProductName(productName)}
        />

        <TextInput
          placeholder="Ár"
          placeholderTextColor={placeholderTextColor}
          style={[styles.Font, styles.Input]}
          onChangeText={productMainPrice => setMainPrice(productMainPrice)}
        />
      </View>

      <Button title="Hozzáadás" onPress={() => handleAddProductToInventory()} />
    </View>
  );
};
