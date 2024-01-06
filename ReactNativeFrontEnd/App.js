import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Switch} from 'react-native';
import axios from 'axios';

export default function App() {
  const [newToDoItem, changeNewToDoItemText] = React.useState();
  const [toDoList, setToDoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getToDoList();
  }, []);

  axios.get('http://10.0.2.2:5197/martin')
  .then(response => console.log(response.data))
  .catch(console.error);

  const  getToDoList = () => {
    axios.get('http://10.0.2.2:5197/ToDoList')
      .then((response) => {
        setToDoList(response.data.listOfToDoItems);
        setIsLoading(false); // Set loading to false after data is fetched
      })
      .then(() => {
        // Log and iterate over the array after state has been updated
        console.log(toDoList);
        toDoList.forEach(item => console.log(item.name));
      })
      .catch(console.error);
  }

  const ToggleCompletitionOfItem = (isComplete, id) => {
    const data = {
      message: String(isComplete),
      id: String(id)
    };

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    axios.post('http://10.0.2.2:5197/ToggleCompletitionOfItem', data, config)
      .then(response => {
        console.log("hurmakaki");
        getToDoList();
      })
      .catch(error => {
        console.error(error);
      });
  }

  const postNewItem = async () => {
    const data = {
      message: String(newToDoItem)
    };
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    await axios.post('http://10.0.2.2:5197/NewItem', data, config)
      .then(response => {        
        console.log("podo mnou bude prazdny riadok");

        console.log(response.status);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const ToDoItem = ({name, isComplete, id}) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text>{name}</Text>
    <Switch
     onValueChange={() => ToggleCompletitionOfItem(isComplete, id)}
     value={toDoList[id].isComplete}
    />

  </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <TextInput 
      value={newToDoItem} 
      onChangeText={changeNewToDoItemText}
      onSubmitEditing={async() => {
        changeNewToDoItemText('Write yourself an objetive');
        await postNewItem();
        getToDoList();
      }}
      placeholder='Write yourself an objetive' />
      
      {isLoading ? (
        <Text>Loading...</Text> // Display loading message while data is being fetched
      ) : (
        toDoList.length > 0 && 
        <Text></Text>
        
      )}

      <FlatList
        horizontal={false}
        data={toDoList}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ToDoItem name={item.name} isComplete={item.isComplete} id={item.id}/>}
      />
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
