import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default MainSettings = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [primaryCurrency, setPrimaryCurrency] = useState('');

  return (
    <View>
      <TextInput
        onChangeText={restaurantName => setRestaurantName(restaurantName)}
        placeholder="Létesítmény neve"
      />
      <TouchableOpacity
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

      <TextInput
        onChangeText={primaryCurrency => setPrimaryCurrency(primaryCurrency)}
        placeholder="Fő pénznem"
      />
      <TouchableOpacity
        onPress={() => {
          console.log(primaryCurrency);
          sqlQuery(
            'UPDATE MainSettings SET value=? WHERE setting_name=?',
            null,
            primaryCurrency,
            'primary_currency',
          );
        }}>
        <Text>Módosítás</Text>
      </TouchableOpacity>
    </View>
  );
};
