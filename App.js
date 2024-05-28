import { StyleSheet, Text, View,Image,ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DarkModeProvider } from './screens/settings/DarkMode'
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
import BugReport from './screens/BugReport';
import ContactUsScreen from './screens/ContactUsScreen';
import ProfileEdit from './screens/ProfileEdit';
import ProductDetail from './screens/Data/ProductDetail';
import ProductData from './screens/Data/ProductData';
import SearchResults from './screens/Data/SearchResults';
import Checkout from './screens/Checkout';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <DarkModeProvider>
    <NavigationContainer >
    <Stack.Navigator initialRouteName='Search'>
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
      <Stack.Screen name='BugReport' component={BugReport}/>
      <Stack.Screen name="ContactUsScreen" component={ContactUsScreen}/>
      <Stack.Screen name="ProfileEdit" component={ProfileEdit}/>
      <Stack.Screen name="ProductDetail" component={ProductDetail}/>
      <Stack.Screen name="SearchResults" component={SearchResults}/>
      <Stack.Screen name="Checkout" component={Checkout}/>
   

    </Stack.Navigator>
    </NavigationContainer>
    </DarkModeProvider>
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
