import React from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import { ProfileData, validateEmail, validateString } from "../utils";
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ navigation }: { navigation: NavigationProp<any> }) {

    const [firstName, setFirstName] = React.useState('');
    const [email, setEmail] = React.useState('');

    const isEmailValid = validateEmail(email);

    const isFirstNameValid = validateString(firstName);

    const onClicked = async () => {
        await AsyncStorage.setItem('LoggedIn', 'true');

        const profileData: ProfileData = {
            profileImage: '',
            profileEmail: email,
            firstName: firstName,
            lastName: '',
            phoneNumber: '',
            orderStatus: false,
            passwordChanges: false,
            specialOffers: false,
            newsLetters: false
        };

        await AsyncStorage.setItem('profileData', JSON.stringify(profileData));

        navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
        });
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollviewContent}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image style={styles.logo} source={require("../images/logo.png")} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.textView}>Let us get to know you</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.textView}>First Name</Text>
                        <TextInput style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            keyboardType="default"
                            placeholder={"Please enter your first name"}
                            autoCapitalize="words"></TextInput>
                        {(!isFirstNameValid && firstName !== '') && <Text style={styles.validationText}>First Name should not be empty and must not contain numbers or special characters.</Text>}

                        <Text style={styles.textView}>Email</Text>
                        <TextInput style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            placeholder={"Please enter your email"}></TextInput>
                        {(!isEmailValid && email !== '') && <Text style={styles.validationText}>Please enter a valid email address.</Text>}
                    </View>
                </View>
                <View style={styles.footer}>
                    <Button onPress={onClicked}
                        disabled={!isEmailValid || !isFirstNameValid}
                        pressedStyle={styles.button}
                        textStyle={styles.buttontextView}
                        disabledStyle={styles.disablebutton}>
                        Next
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    header: {
        backgroundColor: '#EDEFEE',
        flex: 0.15,
    },
    logo: {
        resizeMode: 'contain',
        height: 100,
        width: 250,
        alignSelf: 'center',
        flex: 1,
    },
    scrollviewContent: {
        flexGrow: 1,
    },
    section: {
        backgroundColor: 'lightgrey',
        flex: 0.7,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 10,
        width: '100%',
    },
    validationText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: 'red',
        width: '80%',
        fontFamily: 'MarkaziText-Regular',
    },
    textView: {
        fontSize: 20,
        fontWeight: 'semibold',
        textAlign: 'center',
        paddingTop: 20,
        fontFamily: 'Karla-Regular',
    },
    buttontextView: {
        fontSize: 20,
        fontWeight: 'semibold',
        textAlign: 'center',
        fontFamily: 'Karla-Regular',
    },
    inputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
    },
    input: {
        fontSize: 20,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        width: '80%',
        marginVertical: 10,
        color: 'black',
        fontFamily: 'Karla-Regular',
    },
    footer: {
        backgroundColor: '#EDEFEE',
        flex: 0.15,
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 40,
    },
    disablebutton: {
        backgroundColor: '#EDEFEE',
        opacity: 0.5,
    },
    button: {
        backgroundColor: 'lightgrey',
        color: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        padding: 8,
        elevation: 3,
        width: '35%',
    }
});