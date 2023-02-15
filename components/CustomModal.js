import React, {useState} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

export default CustomModal = ({setAddTableModalOpen, setForceRefresh}) => {
  const [newTableName, setNewTableName] = useState();

  function handleAddNewTable() {
    sqlQuery('INSERT INTO LocalTable (name) VALUES (?)', null, newTableName);
    setForceRefresh(true);
  }

  return (
    <Modal transparent={true}>
      <View style={styles.addTableModal}>
        <SafeAreaView>
          <TextInput
            onChangeText={newTableName => setNewTableName(newTableName)}
            placeholder={'Asztal neve'}
            placeholderTextColor="#2b2b28"
          />

          <TouchableOpacity onPress={() => handleAddNewTable()}>
            <Text>Hozzáadás</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <TouchableOpacity onPress={() => setAddTableModalOpen(false)}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  addTableModal: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#2b2b28',
    height: '60%',
  },
});
