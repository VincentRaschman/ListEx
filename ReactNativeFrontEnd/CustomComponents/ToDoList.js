import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Switch, Pressable} from 'react-native';
import axios from 'axios';
import ToDoItem from "./ToDoItem";

export default function ToDoList({allListData, isLoading, DeleteList, GetAllToDoLists}) {
    const [newToDoItem, changeNewToDoItemText] = useState(null);
    const [listName, setListName] = useState(allListData.listName);
    const [listId, setListId] = useState(allListData.id);
    const [listOfToDoItems, setListOfToDoItems] = useState([]);

    useEffect(() => {
      setListOfToDoItems(allListData.listOfToDoItems)
    }, [allListData.listOfToDoItems]);

    console.log("rendering list:");
    console.log(listName);
    console.log(listOfToDoItems);


    //console.log(listOfToDoItems);

    const postNewItem = async (newToDoItem) => {
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

    const DeleteItem = (itemId) => {
        const data = {
          id: String(itemId),
          ListId: String(listId)
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

    const ToggleCompletionOfItem = (isComplete, itemId) => {
        const data = {
          switchState: String(isComplete),
          id: String(itemId),
          listId: String(listId)
        };
    
        axios.post('http://10.0.2.2:5197/ToggleCompletionOfItem', data)
          .then(response => {
            console.log("hurmakaki");
            GetAllToDoLists();
            ///getToDoList();
          })
          .catch(error => {
            console.error(error);
          });
    }

    const ChangeItemName = (newName, itemId) => {
        const data = {
          newName: String(newName),
          id: String(itemId),
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

    const ChangeTag = (newTag, itemId) => {
      const data = {
        newTag: String(newTag),
        id: String(itemId),
        listId: String(listId)
      };
  
      axios.post('http://10.0.2.2:5197/ChangeTag', data)
        .then(response => {
          console.log("Sending new tag to bach end");
          GetAllToDoLists();
          ///getToDoList();
        })
        .catch(error => {
          console.log("Items Tag was not changed");
          console.error(error);
        });
    }

    const handleOnPress_DeleteList = () => { 
      DeleteList(listId)
    };

    return(
      <View style={styles.listWrapper}>
        <Text style={styles.regularText}>{listName}</Text>
        <Pressable onPress={() => handleOnPress_DeleteList(listId)}>
          <Text style={styles.regularText} >Delete list</Text>
        </Pressable>
        <TextInput 
          style={styles.textInput}
          placeholderTextColor="#1B2430"
          value={newToDoItem} 
          onChangeText={changeNewToDoItemText}
          onSubmitEditing={async() => {
            // Need to add input sanity check
            if (newToDoItem != null) {
              await postNewItem(newToDoItem, listId);
              // Updates and re-render list with new item
              ///getToDoList();
              GetAllToDoLists();
              changeNewToDoItemText(null);
            }
          }}
          placeholder='Write yourself an objetive' />
          
          { isLoading ? (
            <Text >Loading...</Text> // Display loading message while data is being fetched
          ) : (
            listOfToDoItems.length > 0 && 
            <Text></Text>
            
          )}

          {
          ( listOfToDoItems.length != 0) ? 
          (<FlatList
            horizontal={false}
            data={listOfToDoItems}
            keyExtractor={item => item.id}
            renderItem={({item}) => <ToDoItem allItemData={item} listId={listId} ChangeTag={ChangeTag} DeleteItem={DeleteItem} ToggleCompletitionOfItem={ToggleCompletionOfItem}
             ChangeItemName={ChangeItemName}/>}
          />)
          :
          (<Text style={styles.regularText}>No items added to list</Text>)}

        </View>
    );
  }

const styles = StyleSheet.create({
  listWrapper: {
    alignItems: 'center',
    borderColor: '#51557E',
    borderWidth: 3,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  regularText: {
    color: '#D6D5A8',
  },
  textInput: {
    marginTop: 10,
    backgroundColor: '#51557E',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    color: '#D6D5A8',
  },
});