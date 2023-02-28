import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default MainSettings = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [mainPrice, setMainPrice] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <TextInput
          style={styles.input}
          onChangeText={restaurantName => setRestaurantName(restaurantName)}
          placeholder="Létesítmény neve"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            sqlQuery(
              'UPDATE MainSettings SET value=? WHERE setting_name=?',
              null,
              restaurantName,
              'restaurant_name',
            );
          }}>
          <Text>Módosítás</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingContainer}>
        <TextInput
          style={styles.input}
          onChangeText={mainPrice => setMainPrice(mainPrice)}
          placeholder="Fő pénznem"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log(mainPrice);
            sqlQuery(
              'UPDATE MainSettings SET value=? WHERE setting_name=?',
              null,
              mainPrice,
              'main_price',
            );
          }}>
          <Text>Módosítás</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#323232',
    height: '100%',
    paddingVertical: 60,
    borderTopWidth: 2,
    borderTopColor: '#14BCB2',
  },
  input: {
    backgroundColor: 'white',
    width: '65%',
  },
  button: {
    padding: 5,
    justifyContent: 'center',
    backgroundColor: '#14BCB2',
  },
  settingContainer: {
    marginVertical: 35,
    flexDirection: 'row',
  },
});
