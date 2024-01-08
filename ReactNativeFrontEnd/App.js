import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Switch} from 'react-native';
import axios from 'axios';

export default function App() {
  const [newToDoItem, changeNewToDoItemText] = React.useState(null);
  const [toDoList, setToDoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect hook triggered");
    getToDoList();
  }, []);

  const Pastika = () => {
    axios.get('http://10.0.2.2:5197/martin')
    .then(response => console.log(response.data))
    .catch(console.error);
  }

  const getToDoList = () => {
    axios.get('http://10.0.2.2:5197/ToDoList')
      .then((response) => {
        setToDoList(response.data.listOfToDoItems);
        setIsLoading(false);
      })
      .then(() => {
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

    axios.post('http://10.0.2.2:5197/ToggleCompletitionOfItem', data)
      .then(response => {
        console.log("hurmakaki");
        getToDoList();
      })
      .catch(error => {
        console.error(error);
      });
  }

  const ChangeItemName = (newName, id) => {
    const data = {
      newName: String(newName),
      id: String(id)
    };

    axios.post('http://10.0.2.2:5197/ChangeNameOfAnItem', data)
      .then(response => {
        console.log("Sending new name to backend");
        getToDoList();
      })
      .catch(error => {
        console.log("New item name was not sent to server");
        console.error(error);
      });
  }

  const postNewItem = async () => {
    const data = {
      itemName: String(newToDoItem)
    };

    await axios.post('http://10.0.2.2:5197/NewItem', data)
      .then(response => {        
        console.log("New item sent to server");
        console.log(response.status);
      })
      .catch(error => {
        console.log("New Item was not sent to server");
        console.error(error);
      });
  }

  const ToDoItem = ({name, isComplete, id}) => {
    const [itemName, setItemName] = useState(name);
    const handleBlur = () => { 
      (name ==  itemName) ? () => {console.log("terneri condition");} : ChangeItemName(itemName, id)
    };
    return(
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput 
          placeholder="Write yourself an objetive"
          onBlur={handleBlur}
          //onBlur={() => {console.log("OnBlur was triggered");}}
          value={itemName} 
          onChangeText={setItemName}
          />
        <Switch
        onValueChange={() => ToggleCompletitionOfItem(isComplete, id)}
        value={toDoList[id].isComplete}
        />

      </View>
    )
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <TextInput 
      onBlur={() => console.log('Input field blurred')}
      value={newToDoItem} 
      onChangeText={changeNewToDoItemText}
      onSubmitEditing={async() => {
        // Nseed to add input sanity check
        if (newToDoItem != null) {
          await postNewItem();
          // Updates and re-render list with new item
          getToDoList();
          changeNewToDoItemText(null);
        }
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
