import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';
import Papa from 'papaparse';
import {PermissionsAndroid} from 'react-native';

var RNFS = require('react-native-fs');

export default CompletedOrder = ({navigation, route}) => {
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.date + ' fizetett rendelései',
    });
  });

  let isVisible = useIsFocused();

  //SQL GET ALL completed orders
  useEffect(() => {
    if (isVisible) {
      let currentDate = route.params.date;
      sqlQuery(
        'SELECT * FROM CompletedOrder WHERE order_date=?',
        setCompletedOrders,
        currentDate,
      );
    }
  }, [isVisible, completedOrders]);

  const handleClick = async () => {
    try {
      // Check for Permission (check if permission is already given or not)
      let isPermitedExternalStorage = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (!isPermitedExternalStorage) {
        // Ask for permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage permission needed',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted (calling our exportDataToExcel function)
          toCSV();
          console.log('Permission granted');
        } else {
          // Permission denied
          console.log('Permission denied');
        }
      } else {
        // Already have Permission (calling our exportDataToExcel function)
        toCSV();
      }
    } catch (e) {
      console.log('Error while checking permission');
      console.log(e);
      return;
    }
  };

  function toCSV() {
    let new_data = Papa.unparse(completedOrders);

    //WRITE
    // create a path you want to write to
    // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    var path = RNFS.DownloadDirectoryPath + '/' + route.params.date + '.csv';

    // write the file
    RNFS.writeFile(path, new_data, 'ascii')
      .then(success => {
        console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });

    //READ
    // get a list of files and directories in the main bundle
    // RNFS.readDir(RNFS.DownloadDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    // .then((result) => {
    //   //console.log('GOT RESULT', result);

    //   // stat the first file
    //   return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    // })
    // .then((statResult) => {
    //   if (statResult[0].isFile()) {
    //     // if we have a file, read it
    //     return RNFS.readFile(statResult[1], 'ascii');
    //   }

    //   return 'no file';
    // })
    // .then((contents) => {
    //   // log the file contents
    //   console.log(contents);
    // })
    // .catch((err) => {
    //   console.log(err.message, err.code);
    // });
  }

  function deleteCompletedOrder(cOrderId) {
    sqlQuery('DELETE FROM CompletedOrder WHERE id=?;', null, cOrderId);
  }

  const renderOrderItem = ({item}) => {
    return (
      <View style={styles.TableItem}>
        <Text style={styles.Bold}>{item.product_name}</Text>
        <Text>
          Fizetés dátuma: <Text style={styles.Bold}>{item.order_date}</Text>
        </Text>
        <TouchableOpacity onPress={() => deleteCompletedOrder(item.id)}>
          <Text
            style={{
              backgroundColor: 'red',
              padding: 5,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Törlés
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <View>
        <TouchableOpacity
          onPress={() => handleClick()}
          style={{
            backgroundColor: 'yellow',
            padding: 5,
            maxWidth: 60,
            textAlign: 'center',
            margin: 8,
          }}>
          <Text style={styles.Font}>Export</Text>
        </TouchableOpacity>
      </View>

      <View>
        <FlatList
          data={completedOrders}
          renderItem={renderOrderItem}
          keyExtractor={orderItem => orderItem.id}
          numColumns={1}
        />
      </View>
    </View>
  );
};
