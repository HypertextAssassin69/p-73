import * as React from 'react';
import { Text, View, StyleSheet,Image } from 'react-native';

import SearchScreen from './screens/search'
import BookTransaction from './screens/transaction'
import { createAppContainer }from 'react-navigation';
import { createSwitchNavigator} from 'react-navigation'; 
import {createBottomTabNavigator} from 'react-navigation-tabs';

// You can import from local files


export default class App extends React.Component {
  render(){
    
    return(
      
     
      
      <AppContainer />
     
      
    )
  }
}
  var TabNavigator = createBottomTabNavigator({

    SearchScreen:{screen:SearchScreen},
    BookTransaction:{screen:BookTransaction}

  },
  {
   defaultNavigationOptions:({navigation})=>({
     tabBarIcon:()=>{
      const routeName = navigation.state.routeName
      console.log(routeName);
      if(routeName === "BookTransaction"){
        return(
          <Image 
          source = {require("./assets/book.png")}
          style={{width :40,height:40}}
          />
            
        )

      }else if(routeName==="SearchScreen"){
        return(
          <Image 
          source = {require("./assets/searchingbook.png")}
          style={{width :40,height:40}}
          />
            
        )
      } 
     }
   })
  })
  const AppContainer = createAppContainer(TabNavigator)


