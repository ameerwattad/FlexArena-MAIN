// Bottomafterlogin.js
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import Search from './Search';
import Cart from './Cart';
import Profile from './Profile';
import AdminDashboard from './AdminDashboard';
import { auth, database } from './firebase'; // Import Firebase auth and database
import { ref, get } from 'firebase/database';


const Tab = createBottomTabNavigator();

export default function Bottomafterlogin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userEmail = user.email;
        console.log('Current User Email:', userEmail);
  
        const adminsRef = ref(database, 'admins');
        console.log('Admins Reference Path:', adminsRef.toString());
  
        const snapshot = await get(adminsRef);
        if (snapshot.exists()) {
          const admins = snapshot.val();
          console.log('Full Admins Snapshot:', admins);
  
          const isAdmin = Object.values(admins).some(admin => admin.email === userEmail);
          if (isAdmin) {
            setIsAdmin(true);
            console.log('Admin signed in');
          } else {
            setIsAdmin(false);
            console.log('Regular user signed in');
          }
        } else {
          console.log('No admins found in the database');
        }
      }
    };
  
    checkAdminStatus();
  }, []);
  
  

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'AdminDashboard') {
            iconName = focused ? 'shield' : 'shield-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Profile" component={Profile} />
      {isAdmin && <Tab.Screen name="AdminDashboard" component={AdminDashboard} />}
    </Tab.Navigator>
  );
}
