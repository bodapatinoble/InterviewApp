import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CategoryScreen from './screens/CategoryScreen';
import ItemListScreen from './screens/ItemListScreen';
import {ItemProvider} from './screens/ItemContext';
import QuestionDetailScreen from './screens/QuestionDetailScreen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <ItemProvider>
        <Stack.Navigator initialRouteName=" ">
          <Stack.Screen
            name="CategoryScreen"
            component={CategoryScreen}
            options={{title: 'Categories'}}
          />
          <Stack.Screen
            name="ItemListScreen"
            component={ItemListScreen}
            options={{title: 'Item List'}}
          />
          <Stack.Screen
            name="QuestionDetailScreen"
            component={QuestionDetailScreen}
          />
        </Stack.Navigator>
      </ItemProvider>
    </NavigationContainer>
  );
};

export default App;
