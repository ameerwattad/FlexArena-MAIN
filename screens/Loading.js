import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

export default function Loading({navigation}) {
  const animation = useRef(null);
  const [isSplashScreen,setIsSplashScreen]=useState(true);
  useEffect(() => {
    animation.current?.play();
    setTimeout(()=>{
        navigation.replace('Bottom');
    },5000);
  }, [navigation]);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 300,
          height: 300,
          backgroundColor: 'white',
        }}
        source={require('../assets/Animation - 1716280407848.json')}
        
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  
});
