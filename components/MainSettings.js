import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';
import {updateMainSettingsContext} from '../App';

export default MainSettings = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [primaryCurrency, setPrimaryCurrency] = useState('');
  const [updateMainSettings, setUpdateMainSettings] = useContext(
    updateMainSettingsContext,
  );

  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <TextInput
          style={styles.input}
          onChangeText={restaurantName => {
            setRestaurantName(restaurantName);
          }}
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
            setUpdateMainSettings(true);
          }}>
          <Text>Módosítás</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingContainer}>
        <TextInput
          style={styles.input}
          onChangeText={mainPrice => {
            setPrimaryCurrency(mainPrice);
          }}
          placeholder="Fő pénznem"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            sqlQuery(
              'UPDATE MainSettings SET value=? WHERE setting_name=?',
              null,
              primaryCurrency,
              'primary_currency',
            );
            setUpdateMainSettings(true);
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
