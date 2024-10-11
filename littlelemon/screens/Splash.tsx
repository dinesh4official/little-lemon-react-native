import * as React from 'react';
import { ActivityIndicator, Text, StyleSheet, Image, View } from 'react-native';

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require("../images/logo.png")} />
            <Text style={styles.text}>Loading...</Text>
            <ActivityIndicator size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        resizeMode: 'contain',
        height: 100,
        width: 250,
        alignSelf: 'center',
        flex: 0.5,
    },
    text: {
        padding: 20,
        fontSize: 20,
        fontWeight: 'bold',
    }
});