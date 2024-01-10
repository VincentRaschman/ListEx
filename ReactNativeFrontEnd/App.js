import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Switch, Pressable} from 'react-native';
import axios from 'axios';

export default function App() {
  const [toDoList, setToDoList] = useState([]);
  const [toDoLists, setToDoLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newToDoListname, setToDoListname] = useState(null)

  useEffect(() => {
    console.log("useEffect hook triggered");
    GetAllToDoLists();
  }, []);

  const Pastika = () => {
    axios.get('http://10.0.2.2:5197/martin')
    .then(response => console.log(response.data))
    .catch(console.error);
  }

  const getToDoList = (id) => {
    axios.get(`http://10.0.2.2:5197/GetOneToDoList?id=${id}`)
      .then((response) => {
        setToDoList(response.data.listOfToDoItems);
      })
      .then(() => {
        console.log(toDoList);
        toDoList.forEach(item => console.log(item.name));
      })
      .catch(console.error);
  }

  const GetAllToDoLists = () => {
    axios.get(`http://10.0.2.2:5197/GetAllToDoLists`)
      .then((response) => {
        setToDoLists(response.data.toDoLists)
        setIsLoading(false);
      })
      .then(() => {
        console.log(toDoList);
      })
      .catch(console.error);
  }

  const ToggleCompletitionOfItem = (isComplete, id, listId) => {
    const data = {
      message: String(isComplete),
      id: String(id),
      listId: String(listId)
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

  const ChangeItemName = (newName, id, listId) => {
    const data = {
      newName: String(newName),
      id: String(id),
      listId: String(listId)
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

  const DeleteItem = (id) => {
    const data = {
      id: String(id)
    };

    axios.post('http://10.0.2.2:5197/DeleteItem', data)
      .then(response => {
        console.log("Deleting item");
        getToDoList();
      })
      .catch(error => {
        console.log("Item was not deleted");
        console.error(error);
      });
  }

  const postNewItem = async (newToDoItem, listId) => {
    const data = {
      itemName: String(newToDoItem),
      listId: String(listId)
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

  const postNewList= async () => {
    const data = {
      listName: String(newToDoListname)
    };

    await axios.post('http://10.0.2.2:5197/NewList', data)
      .then(response => {
        console.log("New list created");
        console.log(response.status);
      })
      .catch(error => {
        console.log("New list was not created");
        console.error(error);
      });
  }

  const ToDoItem = ({name, isComplete, id, listId}) => {
    const [itemName, setItemName] = useState(name);
    const handleBlur = () => { 
      (name ==  itemName) ? () => {console.log("terneri condition");} : ChangeItemName(itemName, id, listId)
    };
    const handleOnPress = (id) => { 
      DeleteItem(id, listId)
    };
    return(
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput 
          placeholder="Write yourself an objetive"
          onBlur={handleBlur}
          value={itemName} 
          onChangeText={setItemName}
          />
        <Switch
        onValueChange={() => ToggleCompletitionOfItem(isComplete, id, listId)}
        value={toDoList[id].isComplete}
        />
        <Pressable onPress={() => handleOnPress(id)}>
          <Text>Delete</Text>
        </Pressable>
      </View>
    )
  };

  const ToDoList = ({listName, listId}) => {
    const [listId, setListId] = useState(listId);
    const [listName, setListName] = useState(listName);
    const [newToDoItem, changeNewToDoItemText] = React.useState(null);
    <View>
      <Text>{listName}</Text>
      <TextInput 
        value={newToDoItem} 
        onChangeText={changeNewToDoItemText}
        onSubmitEditing={async() => {
          // Nseed to add input sanity check
          if (newToDoItem != null) {
            await postNewItem(newToDoItem, listId);
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
          renderItem={({item}) => <ToDoItem name={item.name} isComplete={item.isComplete} id={item.id} listId={listId}/>}
        />
      </View>
  }

  return (
    (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <TextInput 
          placeholder="Create new to do list!"
          //onBlur={handleBlur}
          value={newToDoListname} 
          onChangeText={setToDoListname}
          onSubmitEditing={async() => {
            // Nseed to add input sanity check
            if (newToDoListname != null) {
              await postNewList();
              // Updates and re-render list with new item
              setToDoListname(null);
            }
          }}
          />
      <ToDoList listName={newToDoListname}/>
      <FlatList
          horizontal={false}
          data={toDoLists}
          keyExtractor={list => list.id}
          renderItem={({list}) => <ToDoList listName={list.name} listId={list.id}/>}
        />
    </View>
    )
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
