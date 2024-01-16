import { StyleSheet, Platform } from 'react-native'
import Map from './screens/Map'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import { useState } from 'react'
import { PaperProvider } from 'react-native-paper'
import MainAppbar from './components/MainAppBar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Settings from './components/Settings'

const settings = {
  backgroundColor: '#00a484'
}

const icons = {
  location_not_known: 'crosshairs',
  location_searching: 'crosshairs-question',
  location_found: 'crosshairs-gps'
}

const Stack = createNativeStackNavigator()

export default function App() {

  const [icon, setIcon] = useState(icons.location_not_known)

  const [location, setLocation] = useState({
    latitude: 65.0800,
    longitude: 25.4800,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  })

  const [mapType,setMapType] = useState('standard')

  const getUserPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()

    try {
      setIcon(icons.location_searching)
      if (status !== 'granted') {
        console.log('Geolocation failed')
        setIcon(icons.location_not_known)
        return
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
      setLocation({ ...location, "latitude": position.coords.latitude, "longitude": position.coords.longitude })
      setIcon(icons.location_found)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <PaperProvider>
<NavigationContainer>
  <Stack.Navigator
    initialRouteName='Map'
    screenOptions={{
      header: (props) => <MainAppbar {...props} backgroundColor={settings.backgroundColor} icon={icon} getUserPosition={getUserPosition} />,
    }}
  >
    <Stack.Screen name='Map'>
      {(props) => <Map {...props} location={location} mapType={mapType} />}
    </Stack.Screen>
    <Stack.Screen name='Settings'>
  {(props) => <Settings {...props} backgroundColor={settings.backgroundColor} mapType={mapType} setMapType={setMapType} />}
</Stack.Screen>

  </Stack.Navigator>
</NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
  },
});
