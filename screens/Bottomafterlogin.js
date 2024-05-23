import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './Home';
import Search from './Search';
import Cart from './Cart';
import Profile from './Profile';
import { Ionicons } from '@expo/vector-icons';
import Login from './Login';


export default function Bottomafterlogin() {
    const Tab = createBottomTabNavigator(); 

  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor;  
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            iconColor= focused ? 'blue': 'white'; 
          } else if(route.name==='Search'){
            iconName = focused ? 'search' : 'search-outline';
            iconColor = focused ? 'blue' : 'white' ; 
          }else if(route.name==='Cart'){
            iconName = focused ? 'cart' : 'cart-outline';
            iconColor= focused ? 'blue' : 'white'; 
          }else if(route.name==='Profile'){
            iconName= focused ? 'person': 'person-outline';
            iconColor= focused ? 'blue' : 'white';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
        <Tab.Screen name='Home' component={Home}/> 
        <Tab.Screen name='Search' component={Search} />
        <Tab.Screen name='Cart' component={Cart}/>
        <Tab.Screen name='Profile' component={Profile} />
    </Tab.Navigator>
  )
}