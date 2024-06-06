import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StripeProvider } from '@stripe/stripe-react-native'; // Import StripeProvider
import { DarkModeProvider } from './screens/settings/DarkMode';
import Membership from './screens/Membership';
import Home from './screens/Home';
import Login from './screens/Login';
import Bottom from './screens/Bottom';
import Loading from './screens/Loading';
import Bottomafterlogin from './screens/Bottomafterlogin';
import BugReport from './screens/BugReport';
import ContactUsScreen from './screens/ContactUsScreen';
import ProfileEdit from './screens/ProfileEdit';
import ProductDetail from './screens/Data/ProductDetail';
import ProductData from './screens/Data/ProductData';
import SearchResults from './screens/Data/SearchResults';
import Checkout from './screens/Checkout';
import Wishlist from './screens/Wishlist';
import Orders from './screens/Orders';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_1370KkDd7LEWuaI886nnZxQR">
      <DarkModeProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Search">
            <Stack.Screen name="Bottom" component={Bottom} options={{ headerShown: false }} />
            <Stack.Screen name="Bottomafterlogin" component={Bottomafterlogin} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="Membership" component={Membership} />
            <Stack.Screen name="BugReport" component={BugReport} />
            <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name="SearchResults" component={SearchResults} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="Wishlist" component={Wishlist} />
            <Stack.Screen name="Orders" component={Orders} />
          </Stack.Navigator>
        </NavigationContainer>
      </DarkModeProvider>
    </StripeProvider>
  );
}
