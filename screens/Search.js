import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import { Octicons } from '@expo/vector-icons';

export default function Search({ navigation }) {
  return (
    <PaperProvider>
      <>
        <View style={styles.header}>
          <Text style={styles.headerContent}>
            Shop by category :
          </Text>
          <Octicons name='smiley' color='blue' size={20} style={{ top: 5, marginLeft: 10 }} />
        </View>
        <View style={styles.container}>
          <View style={styles.card}>
            <ScrollView>
              <Button
                icon="pill"
                mode="outlined"
                onPress={() => console.log('Pressed')}
                theme={{
                  colors: {
                    primary: 'blue',  // Text color and border color
                    surface: 'white', // Background color
                  },
                }}
                style={styles.button}
              >
                Supplements
              </Button>
              <Button
                icon="pill"
                mode="outlined"
                onPress={() => console.log('Pressed')}
                theme={{
                  colors: {
                    primary: 'blue',  // Text color and border color
                    surface: 'white', // Background color
                  },
                }}
                style={styles.button}
              >
                Clothes
              </Button>
              <Button
                icon="pill"
                mode="outlined"
                onPress={() => console.log('Pressed')}
                theme={{
                  colors: {
                    primary: 'blue',  // Text color and border color
                    surface: 'white', // Background color
                  },
                }}
                style={styles.button}
              >
                Machines
              </Button>
              <Button
                icon="pill"
                mode="outlined"
                onPress={() => console.log('Pressed')}
                theme={{
                  colors: {
                    primary: 'blue',  // Text color and border color
                    surface: 'white', // Background color
                  },
                }}
                style={styles.button}
              >
                Supplements
              </Button>
              <Button
                icon="pill"
                mode="outlined"
                onPress={() => console.log('Pressed')}
                theme={{
                  colors: {
                    primary: 'blue',  // Text color and border color
                    surface: 'white', // Background color
                  },
                }}
                style={styles.button}
              >
                Machines
              </Button>
              <Button
                icon="pill"
                mode="outlined"
                onPress={() => console.log('Pressed')}
                theme={{
                  colors: {
                    primary: 'blue',  // Text color and border color
                    surface: 'white', // Background color
                  },
                }}
                style={styles.button}
              >
                Supplements
              </Button>
              <Button
                icon="pill"
                mode="outlined"
                onPress={() => console.log('Pressed')}
                theme={{
                  colors: {
                    primary: 'blue',  // Text color and border color
                    surface: 'white', // Background color
                  },
                }}
                style={styles.button}
              >
                Supplements
              </Button>
              <Button
                icon="pill"
                mode="outlined"
                onPress={() => console.log('Pressed')}
                theme={{
                  colors: {
                    primary: 'blue',  // Text color and border color
                    surface: 'white', // Background color
                  },
                }}
                style={styles.button}
              >
                Supplements
              </Button>
              <Button
                icon="pill"
                mode="outlined"
                onPress={() => console.log('Pressed')}
                theme={{
                  colors: {
                    primary: 'blue',  // Text color and border color
                    surface: 'white', // Background color
                  },
                }}
                style={styles.button}
              >
                Supplements
              </Button>
              <Button
                icon="pill"
                mode="outlined"
                onPress={() => console.log('Pressed')}
                theme={{
                  colors: {
                    primary: 'blue',  // Text color and border color
                    surface: 'white', // Background color
                  },
                }}
                style={styles.button}
              >
                Supplements
              </Button>
            </ScrollView>
          </View>
        </View>
      </>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
  },
  headerContent: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 50,
    alignItems: 'center',
  },
  card: {
    width: '80%',
  },
  button: {
    marginVertical: 10, // Space between buttons
  },
});
