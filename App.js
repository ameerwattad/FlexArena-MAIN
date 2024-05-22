import { StyleSheet, Text, View,Image,ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Login from './screens/Login';
import Loading from './screens/Loading';
import Membership from './screens/Membership';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    
    <NavigationContainer >
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name='Home'  component={Home} />
      <Stack.Screen name='Login' component={Login}/>
      <Stack.Screen name='Loading' component={Loading}/>
      <Stack.Screen name='Membership' component={Membership}/>

    </Stack.Navigator>
    </NavigationContainer>
   
  );
}

const styles = StyleSheet.create({
  
  container:{
    flex:1,
    backgroundColor:'#cd5c5c',
  }, 
  image: { 
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  }
});
