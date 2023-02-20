import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';

export default MainSettings = () => {
  return (
    <View>
      <TextInput placeholder="Cég neve" />
      <TouchableOpacity>
        <Text>Módosítás</Text>
      </TouchableOpacity>

      <TextInput placeholder="Fő pénznem" />
      <TouchableOpacity>
        <Text>Módosítás</Text>
      </TouchableOpacity>
    </View>
  );
};
