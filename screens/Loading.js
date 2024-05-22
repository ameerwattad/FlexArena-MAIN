import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';


export default function Loading({navigation}) {
  const animation = useRef(null);
  const [isSplashScreen,setIsSplashScreen]=useState(true);
  useEffect(() => {
    animation.current?.play();
    setTimeout(()=>{
        navigation.replace('Login');
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
          backgroundColor: '#0000ff',
        }}
        source={require('./../assets/images/klson.json')}

      />

    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#38B6FF',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

});