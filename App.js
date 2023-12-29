import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import axios from 'axios';

export default function App() {
  const [newToDoItem, changeNewToDoItemText] = React.useState();
  const [getResponse, changeTextToGetResponse] = React.useState("Placeholder");

  
// Passing configuration object to axios
  axios({
    method: 'get',
    url: `http://10.0.2.2:5197/martin`,
  }).then((response) => {
    console.log(response.data);
    changeTextToGetResponse(response.data);
  }).catch(error => {
    console.error(error);
  });


  const data = {
    message: {newToDoItem}
  };
  
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };


  axios.post('http://10.0.2.2:5197/NewItem', data, config)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <TextInput 
      value={newToDoItem} 
      onChangeText={changeNewToDoItemText}
      onSubmitEditing={() => {
        changeNewToDoItemText('Write yourself an objetive');
      }}
      placeholder='Write yourself an objetive' />
      <Text>{getResponse} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
