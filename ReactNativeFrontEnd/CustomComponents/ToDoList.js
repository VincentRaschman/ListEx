import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Switch, Pressable} from 'react-native';
import axios from 'axios';
import ToDoItem from "./ToDoItem";

export default function ToDoList({allListData, isLoading, DeleteList, GetAllToDoLists, isDarkModeOn}) {
    const [newToDoItem, changeNewToDoItemText] = useState(null);
    const [listName, setListName] = useState(allListData.listName);
    const [listId, setListId] = useState(allListData.id);
    const [listOfToDoItems, setListOfToDoItems] = useState([]);
    const [isRelocatingItem, setIsRelocatingItem] = useState(false);
    const [idOfTheItemToRelocate, setIdOfTheItemToRelocate] = useState(-1);

    useEffect(() => {
      setListOfToDoItems(allListData.listOfToDoItems);
    }, [allListData.listOfToDoItems]);

    useEffect(() => {
      if(idOfTheItemToRelocate != -1)
      {
        setIsRelocatingItem(true);
      }
      else
      {
        setIsRelocatingItem(false);
      }
    }, [idOfTheItemToRelocate]);

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

  const handleOnPress_RelocateItem = (relocateItemId) => {
      const data = {
        newPlaceInList: String(relocateItemId),
        idOfTheItemToRelocate: String(idOfTheItemToRelocate),
        ListId: String(listId)
      };

      setIdOfTheItemToRelocate(-1);

      axios.post('http://10.0.2.2:5197/RelocateItem', data)
        .then(response => {
          console.log("Relocating item");
          ///getToDoList();
          GetAllToDoLists();
        })
        .catch(error => {
          console.log("Item was not relocated");
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

    const RelocateItem = ({relocateItemId}) => (
      <Pressable onPress={() => handleOnPress_RelocateItem(relocateItemId)}>
        <View style={styles.relocateItem}>
          <Text style={styles.regularText}>Move item</Text>
        </View>
      </Pressable>
    );

    const styles = StyleSheet.create({
      listWrapper: {
        alignItems: 'center',
        borderColor: isDarkModeOn ? '#51557E' : '#8EA7E9',
        borderWidth: 3,
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
      },
      regularText: {
        color: isDarkModeOn ? '#D6D5A8' : '#FFF2F2',
      },
      textInput: {
        marginTop: 10,
        backgroundColor: isDarkModeOn ? '#51557E' : '#8EA7E9',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        color: isDarkModeOn ? '#D6D5A8' : '#FFF2F2',
      },
      relocateItem: {
        alignItems: 'center',
        borderColor: isDarkModeOn ? '#51557E' : '#8EA7E9',
        backgroundColor: isDarkModeOn ? '#51557E' : '#8EA7E9',
        borderWidth: 3,
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
      },
    });

    return(
      <View style={styles.listWrapper}>
        <Text style={styles.regularText}>{listName}</Text>
        <Pressable onPress={() => handleOnPress_DeleteList(listId)}>
          <Text style={styles.regularText} >Delete list</Text>
        </Pressable>
        <TextInput 
          style={styles.textInput}
          placeholderTextColor={ isDarkModeOn ? "#1B2430" : '#7286D3'}
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
            <Text >Loading...</Text>
          ) : (
            listOfToDoItems.length > 0 && 
            <Text></Text>
            
          )}

          {
          ( listOfToDoItems.length != 0) ? 
          (
          <View>
            <FlatList
            horizontal={false}
            data={listOfToDoItems}
            keyExtractor={item => item.id}
            renderItem={({item}) => 
             <View>
              {isRelocatingItem ? (<RelocateItem relocateItemId={listOfToDoItems.indexOf(item)}/>) : (<></>)}

              <ToDoItem allItemData={item} listId={listId} ChangeTag={ChangeTag}
              DeleteItem={DeleteItem} idOfTheItemToRelocate={setIdOfTheItemToRelocate} ToggleCompletitionOfItem={ToggleCompletionOfItem}
              ChangeItemName={ChangeItemName} isDarkModeOn={isDarkModeOn}/>
             </View>
            }
            />
            {isRelocatingItem ? (<RelocateItem relocateItemId={listOfToDoItems.length}/>) : (<></>)}
          </View>
          )
          :
          (<Text style={styles.regularText}>No items added to list</Text>)}

        </View>
    );
}