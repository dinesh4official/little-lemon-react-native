import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import OnboardingScreen from './screens/Onboarding';

const AppNavigation = ({ initialRoute, tabInitalRoute }: { initialRoute: string, tabInitalRoute : string }) => {

    const Stack = createNativeStackNavigator()

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
                <Stack.Screen name="OnBoarding" component={OnboardingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Main" options={{ headerShown: false }} >
                    {props => <MainTabNavigator {...props} initialRoute={tabInitalRoute} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation