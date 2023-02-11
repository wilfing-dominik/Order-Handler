import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';

export default styles = StyleSheet.create({
  Font: {
    color: '#2b2b28',
    fontSize: 14,
  },
  Bold: {
    fontWeight: 'bold',
  },
  Input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  HomeContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
    marginBottom: StatusBar.currentHeight || 0,
  },
  HomeItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 125,
    minHeight: 70,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  Hometitle: {
    fontSize: 32,
  },
  TableScreenContainer: {
    flex: 1,
  },
  TableListContainer: {
    flex: 1,
    ColumnsNum: 1,
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  TableItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#66c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    minWidth: 300,
  },
  TableButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 36,
    maxWidth: 420,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  TableSum: {
    fontSize: 18,
  },
  AddProductToTableContainer: {
    flex: 1,
    ColumnsNum: 1,
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
    marginBottom: StatusBar.currentHeight || 0,
  },
  amountChangerContainer: {
    minHeight: 100,
    flex: -4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountButton: {
    textAlign: 'center',
    margin: 30,
    backgroundColor: '#66c2ff',
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 8,
  },
  AllProductContainer: {
    flex: 1,
  },
  AllProductListContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  AllProductItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#66c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  AddProductToInventoryScreen: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
