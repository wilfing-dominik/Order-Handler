import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import {sqlQuery} from '../utils/dbConnection';

// Components
import CustomModal from './CustomModal';

export default Home = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tableSum, setTableSum] = useState([]);

  const [addTableModalOpen, setAddTableModalOpen] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);

  const isVisible = useIsFocused();

  const calculateTableSum = () => {
    let temp = new Array(items.length).fill(0);
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < orders.length; j++) {
        if (items[i].id == orders[j].localtable_id) {
          temp[i] += orders[j].huf * orders[j].amount;
        }
      }
    }
    return temp;
  };

  // SQL GET ALL ORDERS JOINED WITH PRODUCTS
  useEffect(() => {
    if (isVisible) {
      sqlQuery(
        'SELECT * FROM ORD JOIN Product on ORD.product_id = Product.id',
        setOrders,
      );

      let newTableSum = calculateTableSum();
      setTableSum(newTableSum);
    }
  }, [isVisible, items]);

  // SQL GET ALL TABLES
  useEffect(() => {
    if (isVisible) {
      sqlQuery('SELECT * FROM LocalTable', setItems);
      setForceRefresh(false);
    }
  }, [isVisible, forceRefresh]);

  const Table = ({item, onPress}) => (
    <TouchableOpacity style={styles.table} onPress={onPress}>
      <Text style={styles.tableNameText}>{item.name}</Text>
      <Text
        style={
          tableSum[item.id - 1] === 0 ? {color: '#3CD68C'} : {color: '#14BCB2'}
        }>
        {tableSum[item.id - 1] === 0 ? 'Szabad' : tableSum[item.id - 1] + 'Ft'}
      </Text>
    </TouchableOpacity>
  );

  const renderTable = ({item}) => {
    return (
      <Table
        item={item}
        onPress={() =>
          navigation.navigate('OrdersByTable', {
            name: item.name,
            id: item.id,
          })
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.topMenu}>
        <Text style={styles.topMenuText}>Order Handler</Text>
        <TouchableOpacity
          onPress={() => {
            alert('megnyomtak!');
          }}>
          <Text style={styles.topMenuText}>Beállítások</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderTable}
        keyExtractor={item => item.id}
        numColumns="3"
        contentContainerStyle={styles.tableList}
      />

      <View style={styles.bottomMenu}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AllProduct')}
          style={styles.button}>
          <Text style={styles.bottomMenuText}>Terméklista</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setAddTableModalOpen(true)}
          style={styles.addTableButton}>
          <Text>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('OrderHistory')}
          style={styles.button}>
          <Text style={styles.bottomMenuText}>Rendeléstörténet</Text>
        </TouchableOpacity>
      </View>

      {addTableModalOpen && (
        <CustomModal
          setAddTableModalOpen={setAddTableModalOpen}
          setForceRefresh={setForceRefresh}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: '#323232',
    flex: 1,
    alignItems: 'center',
  },
  tableList: {
    paddingBottom: 70,
    marginVertical: 1,
  },
  table: {
    borderWidth: 2,
    borderColor: '#14BCB2',
    borderRadius: 15,

    backgroundColor: '#464646',
    margin: 6,
    padding: 5,
    height: 80,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomMenu: {
    backgroundColor: '#14BCB2',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 5,
    paddingVertical: 12,
    marginVertical: 15,
    justifyContent: 'space-between',
    paddingLeft: 45,
    paddingRight: 20,
    alignItems: 'center',
    width: '85%',
    borderRadius: 15,
  },
  button: {
    borderRadius: 4,
  },
  tableNameText: {
    color: '#F2F2F2',
    fontWeight: '600',
  },
  bottomMenuText: {
    color: '#383838',
    fontWeight: '500',
  },
  boldText: {},
  topMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#2b2b28',
    width: '100%',
  },
  topMenuText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  addTableButton: {
    position: 'absolute',
    left: '57%',
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 10,
  },
});
