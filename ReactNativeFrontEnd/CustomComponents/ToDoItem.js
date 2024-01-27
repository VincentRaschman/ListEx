import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Switch, Pressable} from 'react-native';
import axios from 'axios';

export default function ToDoItem({allItemData, listId, DeleteItem, ToggleCompletitionOfItem, ChangeItemName}){
    const [itemName, setItemName] = useState("No items added to this list");
    const [isComplete, setIsComplete] = useState(false);
    const [id, setId] = useState(-1);
    //const [itemTag, setTag] = useState(allItemData.);
    
    useEffect(() => {
      console.log("item data from use effect");
      console.log(allItemData.name);
      console.log(allItemData.isComple);
      console.log(allItemData.id);

      setItemName(allItemData.name);
      setIsComplete(allItemData.isComple);
      setId(allItemData.id);

      console.log(itemName);
      console.log(isComplete);
      console.log(id);
    }, [allItemData]);

    const handleBlur = () => { 
      (allItemData.name ==  itemName) ? () => {console.log("terneri condition");} : ChangeItemName(itemName, id, listId)
    };

    const handleOnPress_DeleteItem = (id, listId) => { 
      DeleteItem(id, listId)
    };

    return(
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput 
          placeholder="An objetive"
          onBlur={handleBlur}
          value={itemName} 
          onChangeText={setItemName}
          />
        <Switch
        onValueChange={() => ToggleCompletitionOfItem(isComplete, id, listId)}
        value={isComplete}
        //value={false}
        />
        <Pressable onPress={() => handleOnPress_DeleteItem(id, listId)}>
          <Text>Delete</Text>
        </Pressable>
      </View>
    )
  };