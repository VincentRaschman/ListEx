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

  useEffect(() => {
    console.log("All lists returned from the server:");
    console.log("Lists in memory:");
    console.log(toDoLists);
    console.log("Foreach log:");
    toDoLists.forEach(item => console.log(item.listName));

    console.log("Logging first lists items:");
    //console.log(toDoLists[0].listOfToDoItems);
    //toDoLists[0].isEmpty ? (console.log("empty")) : (console.log("not empty"));
    
    if(toDoLists != [] && typeof toDoLists != "undefined" && typeof toDoLists != null)
    {
      console.log("vsetko je ok");
      console.log(typeof toDoLists);
      console.log(Array.isArray(toDoLists));
      console.log(toDoLists);
      console.log(toDoLists.length);

      if (toDoLists.length == 0) {
        console.log("ziadne listy nie su na frontende");
      }
      console.log(typeof toDoLists[0]);
      console.log(typeof toDoLists[1]);

      /*console.log(toDoLists[0].listOfToDoItems);
      console.log(toDoLists[1].listOfToDoItems);*/

    }
    else
    {
      console.log("vsetko je na hovno");
    }


    setIsLoading(false);
  }, [toDoLists]);

  const Pastika = () => {
    axios.get('http://10.0.2.2:5197/martin')
    .then(response => console.log(response.data))
    .catch(console.error);
  }

  /*const getToDoList = (id) => {
    axios.get(`http://10.0.2.2:5197/GetOneToDoList?id=${id}`)
      .then((response) => {
        setToDoList(response.data.listOfToDoItems);
      })
      .then(() => {
        console.log(toDoList);
        toDoList.forEach(item => console.log(item.name));
      })
      .catch(console.error);
  }*/

  const GetAllToDoLists = async() => {
    axios.get(`http://10.0.2.2:5197/GetAllToDoLists`)
      .then((response) => {
        setToDoLists(response.data)
      }).catch(console.error);
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
        GetAllToDoLists();
        ///getToDoList();
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
        GetAllToDoLists();
        ///getToDoList();
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
        ///getToDoList();
        GetAllToDoLists();
      })
      .catch(error => {
        console.log("Item was not deleted");
        console.error(error);
      });
  }

  const postNewItem = async (newToDoItem, listId) => {
    console.log("posting item");
    console.log(newToDoItem);

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
        console.log(`New list post sent for list: ${newToDoListname}`);
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
        //value={toDoLists[listId][id].isComplete}
        value={false}
        />
        <Pressable onPress={() => handleOnPress(id)}>
          <Text>Delete</Text>
        </Pressable>
      </View>
    )
  };

  const ToDoList = ({listName, listId, listOfItems}) => {
    console.log("rendering list:");
    console.log(listName);
    console.log(listOfItems);

    const [newToDoItem, changeNewToDoItemText] = React.useState(null);
    return(
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
              ///getToDoList();
              GetAllToDoLists();
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

          {
          ( listOfItems.length != 0) ? 
          (<FlatList
            horizontal={false}
            data={toDoLists[listId].listOfToDoItems}
            keyExtractor={item => item.id}
            renderItem={({item}) => <ToDoItem name={item.name} isComplete={item.isComplete} id={item.id} listId={listId}/>}
          />)
          :
          (<Text>No items added to list</Text>)}

        </View>
    );
  }

    return (
    (
    <View style={styles.container}>
      <TextInput 
          placeholder="Create new to do list!"
          //onBlur={handleBlur}
          value={newToDoListname} 
          onChangeText={setToDoListname}
          onSubmitEditing={async() => {
            // Nseed to add input sanity check
            if (newToDoListname != null) {
              await postNewList();
              GetAllToDoLists();
              // Updates and re-render list with new item
              setToDoListname(null);
            }
          }}
          />
          {console.log("AAAAAAAAAAA")}
          {console.log(toDoLists)}

          { toDoLists.length != 0 ? 
          (
          <FlatList
          ListEmptyComponent={<Text>No lists created!</Text>}
          horizontal={false}
          data={toDoLists}
          keyExtractor={item => item.id}
          renderItem={({item}) => <ToDoList listName={item.listName} listId={item.id} listOfItems={item.listOfToDoItems}/>}
          />)
          : (<Text>No lists added!</Text>)
          }
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
