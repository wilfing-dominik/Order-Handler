import React, {useState} from 'react';
import {SafeAreaView, Text, TextInput, TouchableOpacity} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default Add = () => {
  const [tableName, setTableName] = useState('');

  function addNewTable() {
    sqlQuery('INSERT INTO LocalTable (name) VALUES (?)', null, tableName);
  }

  return (
    <SafeAreaView>
      <TextInput
        onChangeText={newTableName => setTableName(newTableName)}
        placeholder={'Asztal neve'}
        placeholderTextColor="#2b2b28"
      />

      <TouchableOpacity onPress={() => addNewTable()}>
        <Text>Hozzáadás</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
