import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';

import {sqlQuery} from '../utils/dbConnection';

export default CustomModal = ({setAddTableModalOpen, setForceRefresh}) => {
  const [newTableName, setNewTableName] = useState();

  function handleAddNewTable() {
    sqlQuery('INSERT INTO LocalTable (name) VALUES (?)', null, newTableName);
    setForceRefresh(true);
    setAddTableModalOpen(false);
  }

  return (
    <Modal isVisible={true} animationType="fade">
      <View style={[styles.addTableModal, {top: '15%'}]}>
        <Text style={styles.title}>Asztal hozzáadása</Text>

        <TextInput
          style={styles.input}
          onChangeText={newTableName => setNewTableName(newTableName)}
          placeholder={'Asztal neve'}
          placeholderTextColor="#2b2b28"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAddNewTable()}>
            <Text style={styles.buttonText}>Hozzáadás</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setAddTableModalOpen(false)}>
            <Text style={styles.buttonText}>Bezárás</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  addTableModal: {
    borderRadius: 10,
    width: 325,
    paddingVertical: 40,
    backgroundColor: '#2b2b28',
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'white',
    marginHorizontal: 3,
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#14BCB2',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    margin: 20,
    padding: 0,
    maxWidth: '75%',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  buttonText: {
    color: '#2b2b28',
    fontWeight: '500',
  },
});
