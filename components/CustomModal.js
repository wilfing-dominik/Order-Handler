import React, {useState} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

const MODAL_HEIGHT = 250;

export default CustomModal = ({setAddTableModalOpen, setForceRefresh}) => {
  const [newTableName, setNewTableName] = useState();
  const {height: screenHeight} = useWindowDimensions();

  function handleAddNewTable() {
    sqlQuery('INSERT INTO LocalTable (name) VALUES (?)', null, newTableName);
    setForceRefresh(true);
    setAddTableModalOpen(false);
  }

  return (
    <Modal transparent={true} animationType="slide">
      <View
        style={[
          styles.addTableModal,
          {top: (screenHeight - MODAL_HEIGHT) / 2},
        ]}>
        <SafeAreaView>
          <TextInput
            onChangeText={newTableName => setNewTableName(newTableName)}
            placeholder={'Asztal neve'}
            placeholderTextColor="#2b2b28"
          />
        </SafeAreaView>

        <View>
          <TouchableOpacity onPress={() => handleAddNewTable()}>
            <Text>Hozzáadás</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setAddTableModalOpen(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  addTableModal: {
    width: 350,
    backgroundColor: '#2b2b28',
    height: MODAL_HEIGHT,
    position: 'absolute',
    alignSelf: 'center',
  },
});
