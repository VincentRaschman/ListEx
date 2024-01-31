import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Switch, Pressable} from 'react-native';
import axios from 'axios';
import ToDoList from './CustomComponents/ToDoList';

export default function App() {
  const [toDoLists, setToDoLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newToDoListName, setToDoListName] = useState(null)

  useEffect(() => {
    console.log("first useEffect hook triggered");
    GetAllToDoLists();
  }, []);

  useEffect(() => {
    console.log("Get lists has run:");
   
    if(toDoLists != [] && typeof toDoLists != "undefined" && typeof toDoLists != null)
    {
      if (toDoLists.length == 0) {
        console.log("state variable of to do lists is empty");
      }
    }
    else
    {
      console.log("toDoLists is an unexpected type");
    }

    setIsLoading(false);
  }, [toDoLists]);

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

  const DeleteList = (listId) => {
    const data = {
      ListId: String(listId)
    };

    axios.post('http://10.0.2.2:5197/DeleteList', data)
      .then(response => {
        console.log("Deleting List");
        ///getToDoList();
        GetAllToDoLists();
      })
      .catch(error => {
        console.log("List was not deleted");
        console.error(error);
      });
  }

  const postNewList= async () => {
    const data = {
      listName: String(newToDoListName)
    };

    await axios.post('http://10.0.2.2:5197/NewList', data)
      .then(response => {
        console.log(`New list post sent for list: ${newToDoListName}`);
        console.log(response.status);
      })
      .catch(error => {
        console.log("New list was not created");
        console.error(error);
      });
  }

    return (
    (
    <View style={styles.container}>
      <View style={[styles.itemWrapper, styles.textInputItem]}>
        <TextInput 
          style={styles.textInput}
          placeholderTextColor="#816797"
          placeholder="Create new to do list!"
          //onBlur={handleBlur}
          value={newToDoListName} 
          onChangeText={setToDoListName}
          onSubmitEditing={async() => {
            // Nseed to add input sanity check
            if (newToDoListName != null) {
              await postNewList();
              GetAllToDoLists();
              // Updates and re-render list with new item
              setToDoListName(null);
            }
          }}
          />
      </View>

          { toDoLists.length != 0 ? 
          (
          <FlatList
          ListEmptyComponent={<Text style={styles.regularText}>No lists created!</Text>}
          horizontal={false}
          data={toDoLists}
          keyExtractor={item => item.id}
          renderItem={({item}) => <ToDoList allListData={item} isLoading={isLoading} DeleteList={DeleteList}
          GetAllToDoLists={GetAllToDoLists}/>}
          />)
          : (<View style={[styles.itemWrapper, styles.missingItemsText]}><Text style={styles.regularText}>No lists added!</Text></View>)
          }
    </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2430',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: 30,
    paddingLeft: '15%',
    paddingRight: '15%',
  },
  textInput: {
    color: '#D6D5A8',
    backgroundColor: '#1B2430',
    borderRadius: 10,
    borderWidth: 3,
    paddingLeft: 8,
    paddingRight: 8,
    borderColor: '#51557E',
  },
  textInputItem: {
    backgroundColor: '#51557E',
  },
  itemWrapper: {
    alignItems: 'center',
    borderColor: '#51557E',
    borderWidth: 3,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  missingItemsText:{
    borderColor: '#1B2430',
  },
  regularText: {
    color: '#D6D5A8',
  },
});
