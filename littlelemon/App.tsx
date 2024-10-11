import * as React from 'react';
import SplashScreen from './screens/Splash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import AppNavigation from './AppNavigation';

export default function App() {

  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isFirstTime, setIsFirstTime] = React.useState(false);

  const checkIsLoggedIn = async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    try {
      await sleep(2000);

      await Font.loadAsync({
        'Karla-Regular': require('./assets/fonts/Karla-Regular.ttf'),
        'MarkaziText-Regular': require('./assets/fonts/MarkaziText-Regular.ttf'),
      });

      const value = await AsyncStorage.getItem('LoggedIn');
      if (value !== null) {
        setIsLoggedIn(true);

        const value = await AsyncStorage.getItem('IsFirstTime');
        if (value === null) {
          setIsFirstTime(true);
          await AsyncStorage.setItem('IsFirstTime', 'true');
        }
      }
    } catch (e) {
      console.error(e);
    }
    finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    checkIsLoggedIn();
  }, []);

  const initialRoute = (isLoggedIn ? 'Main' : 'OnBoarding');
  const tabInitalRoute = (isFirstTime ? 'Home' : 'Profile');

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AppNavigation initialRoute={initialRoute} tabInitalRoute={tabInitalRoute} />
  );
}