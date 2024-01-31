import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Switch, Pressable} from 'react-native';
import axios from 'axios';

export default function ToDoItem({allItemData, listId, ChangeTag, DeleteItem, ToggleCompletitionOfItem, ChangeItemName}){
    const [itemName, setItemName] = useState("No items added to this list");
    const [isComplete, setIsComplete] = useState(false);
    const [id, setId] = useState(-1);
    const [tag, setTag] = useState('white');
    const [isChoosingTag, setIsChoosingTag] = useState(false);


    //const [itemTag, setTag] = useState(allItemData.);
    
    useEffect(() => {
      console.log("item data from use effect");

      setItemName(allItemData.name);
      setIsComplete(allItemData.isComplete);
      setId(allItemData.id);
      setTag(allItemData.tag);

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
    const handleOnPress_Tag = (id, listId) => { 
      console.log("handleOnPress Tag");
      setIsChoosingTag(true);
    };
    const handleOnPress_ChangeTag = (newTag) => { 
      console.log("TagChanged to");
      console.log(newTag);
      setIsChoosingTag(false);
      ChangeTag(newTag, id);
      setTag(newTag);
    };
    return(
      <>
        {isChoosingTag ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable onPress={() => handleOnPress_ChangeTag('white')}>
            <View style={[styles.tag, {backgroundColor: 'white'}]}>
            </View>
            </Pressable>
            <Pressable onPress={() => handleOnPress_ChangeTag('red')}>
              <View style={[styles.tag, {backgroundColor: 'red'}]}>
              </View>
            </Pressable>
            <Pressable onPress={() => handleOnPress_ChangeTag('green')}>
              <View style={[styles.tag, {backgroundColor: 'green'}]}>
              </View>
            </Pressable>
            <Pressable onPress={() => handleOnPress_ChangeTag('blue')}>
              <View style={[styles.tag, {backgroundColor: 'blue'}]}>
              </View>
            </Pressable>
            <Pressable onPress={() => handleOnPress_ChangeTag('yellow')}>
              <View style={[styles.tag, {backgroundColor: 'yellow'}]}>
              </View>
            </Pressable>
          </View>
        ) : (
          <></>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput 
            style={styles.textInput}
            placeholderTextColor="#2f2b3a"
            placeholder="An objetive"
            onBlur={handleBlur}
            value={itemName} 
            onChangeText={setItemName}
            />
          <Pressable onPress={() => handleOnPress_Tag(id, listId)}>
            <View style={[styles.tag, {backgroundColor: tag}]}>
            </View>
          </Pressable>
          <Switch
          onValueChange={() => ToggleCompletitionOfItem(isComplete, id, listId)}
          value={isComplete}
          //value={false}
          />
          <Pressable onPress={() => handleOnPress_DeleteItem(id, listId)}>
            <Text style={styles.regularText}>Delete</Text>
          </Pressable>
        </View>
      </>
    )
  };

const styles = StyleSheet.create({
  regularText: {
    color: '#D6D5A8',
  },
  textInput: {
    color: '#D6D5A8',
  },
  tag: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#51557E',
  },
});