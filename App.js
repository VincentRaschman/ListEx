import { StatusBar } from 'expo-status-bar';
import React, { useEffect} from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import axios from 'axios';

export default function App() {
  const [text, changeText] = React.useState();

  /*const fetchApi = async () => {
    try{
    const res = await axios.get('http://192.168.0.22:5197/pivo');
    console.log("podarilo sa");
    }
    catch(error)
    {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchApi();
  }, [])*/
  
  fetch('http://localhost:5197/martin')
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <TextInput 
      value={text} 
      onChangeText={changeText}
      placeholder='Write yourself an objetive' />
      <Text>{text}</Text>
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
