import { StyleSheet, Text, View,Image,ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Membership from './screens/Membership';
import Home from './screens/Home';
import Login from './screens/Login';
import Bottom from './screens/Bottom';
import Loading from './screens/Loading';
import Supplements from './screens/Supplements';
import Clothes from './screens/Clothes';
import Machines from './screens/Machines';
import Watches from './screens/Watches';
import Accessories from './screens/Accessories';
import Bottomafterlogin from './screens/Bottomafterlogin';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    
    <NavigationContainer >
    <Stack.Navigator initialRouteName='Bottom'>
    <Stack.Screen name="Bottom" component={Bottom} options={{ headerShown: false }} />
    <Stack.Screen name='Bottomafterlogin' component={Bottomafterlogin} options={{headerShown:false}}/>
      <Stack.Screen name='Home'  component={Home} />
      <Stack.Screen name='Login' component={Login}/>
      <Stack.Screen name='Loading' component={Loading}/>
      <Stack.Screen name='Membership' component={Membership}/>
      <Stack.Screen name='Supplements' component={Supplements}/>
      <Stack.Screen name='Clothes' component={Clothes}/>
      <Stack.Screen name='Machines' component={Machines}/> 
      <Stack.Screen name='Watches' component={Watches}/>
      <Stack.Screen name='Accessories' component={Accessories}/>
    
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
