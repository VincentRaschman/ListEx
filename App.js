import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Switch} from 'react-native';
import axios from 'axios';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];


export default function App() {
  const [getResponse, changeTextToGetResponse] = React.useState("Placeholder");
  const [newToDoItem, changeNewToDoItemText] = React.useState();
  const [toDoList, setToDoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    getToDoList();
  }, []);

  // Passing configuration object to axios
  axios({
    method: 'get',
    url: `http://10.0.2.2:5197/martin`,
  }).then((response) => {
    console.log(response.data);
    changeTextToGetResponse(response.data);
  }).catch(error => {
    console.error(error);
  });

  const getToDoList = () => {
    axios({
      method: 'get',
      url: `http://10.0.2.2:5197/ToDoList`,
    }).then((response) => {
      setToDoList(response.data.listOfToDoItems);
      setIsLoading(false); // Set loading to false after data is fetched

      console.log(toDoList);

      // Iterate over the array
      for(let i = 0; i < toDoList.length; i++) {
        console.log(toDoList[i].name);
      }
      
    }).catch(error => {
      console.error(error);
    });
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

  const postNewItem = () => {
    const data = {
      message: String(newToDoItem)
    };
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    axios.post('http://10.0.2.2:5197/NewItem', data, config)
      .then(response => {
        console.log(response.data);
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
      onSubmitEditing={() => {
        changeNewToDoItemText('Write yourself an objetive');
        postNewItem();
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
