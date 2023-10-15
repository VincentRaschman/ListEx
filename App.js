import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';

export default function App() {
  const [text, changeText] = React.useState("");
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput value={text} 
      onChange={changeText}
      placeholder='Write yourself an objetive' />
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
