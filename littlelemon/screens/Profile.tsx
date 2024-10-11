import { NavigationProp } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View, Image, Text, TextInput, ScrollView, Alert, StatusBar } from 'react-native';
import { ProfileData, validateEmail, validateString, validatePhoneNumber } from "../utils";
import Button from '../components/Button';
import { MaskedTextInput } from "react-native-mask-text";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '../components/CheckBox';

export default function ProfileScreen({ navigation }: { navigation: NavigationProp<any> } = { navigation: {} as NavigationProp<any> }) {

    const loadProfileData = async () => {
        try {
            const profileData = await AsyncStorage.getItem('profileData');
            if (profileData) {
                const data: ProfileData = JSON.parse(profileData);
                setProfileImage(data.profileImage);
                setProfileName(data.firstName);
                setProfileEmail(data.profileEmail);
                setLastName(data.lastName);
                setPhoneNumber(data.phoneNumber);
                setOrderStatus(data.orderStatus);
                setPasswordChanges(data.passwordChanges);
                setSpecialOffers(data.specialOffers);
                setNewsLetters(data.newsLetters);
            }
        } catch (e) {
            Alert.alert('Error', 'An error occurred while loading your profile data.');
        }
    };

    React.useEffect(() => {
        loadProfileData();
    }, []);

    const [profileName, setProfileName] = React.useState('');
    const [profileEmail, setProfileEmail] = React.useState('');
    const [profileImage, setProfileImage] = React.useState<string | null>(null);
    const [lastName, setLastName] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [orderStatus, setOrderStatus] = React.useState(false);
    const [passwordChanges, setPasswordChanges] = React.useState(false);
    const [specialOffers, setSpecialOffers] = React.useState(false);
    const [newsLetters, setNewsLetters] = React.useState(false);

    const isProfileNameValid = validateString(profileName);
    const isLastNameValid = validateString(lastName);
    const isEmailValid = validateEmail(profileEmail);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

    const changeImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const onLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out? This will reset the data.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'OnBoarding' }] });
                        } catch (e) {
                            Alert.alert('Error', 'An error occurred while logging out.');
                        }
                    }
                }
            ]
        );
    };

    const onSaveChanges = () => {
        Alert.alert(
            "Save Changes",
            "Are you sure you want to save the changes?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            await AsyncStorage.setItem('profileData', JSON.stringify({
                                profileImage: profileImage,
                                profileEmail: profileEmail,
                                firstName: profileName,
                                lastName: lastName,
                                phoneNumber: phoneNumber,
                                orderStatus: orderStatus,
                                passwordChanges: passwordChanges,
                                specialOffers: specialOffers,
                                newsLetters: newsLetters
                            }));
                            Alert.alert('Success', 'Your profile data has been saved.');
                        } catch (e) {
                            Alert.alert('Error', 'An error occurred while saving your profile data.');
                        }
                    }
                }
            ]
        );
    };

    const onDiscardChanges = () => {
        Alert.alert(
            "Discard Changes",
            "Are you sure you want to reset the changes?",
            [
                {
                    text: "Cancel",
                },
                {
                    text: "Yes",
                    onPress: () => {
                        loadProfileData();
                    }
                }
            ]
        );
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.header}>
                    <Image
                        source={require("../images/logo.png")}
                        style={styles.logo}
                    />
                </View>
            ),
            headerTitleAlign: 'center',
        });
    }, [navigation]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Personal Information</Text>
                <View style={styles.content}>
                    <Text style={styles.label}>Avatar</Text>
                    <View style={styles.avatarview}>
                        {profileImage ?
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.avatarlogo}
                            /> :
                            <Image
                                source={require("../images/profile.png")}
                                style={styles.avatarlogo}
                            />}
                        <Button onPress={changeImage}
                            pressedStyle={styles.changebutton}
                            textStyle={styles.changebuttontext}>
                            Change
                        </Button>
                        <Button onPress={() => { setProfileImage(null) }}
                            pressedStyle={styles.removebutton}
                            textStyle={styles.removebuttontext}>
                            Remove
                        </Button>
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={styles.label}>First name</Text>
                    <TextInput style={[styles.input, !isProfileNameValid && profileName !== '' && { borderColor: 'red' }]}
                        value={profileName}
                        onChangeText={setProfileName}
                        keyboardType="default"
                        placeholder={"Please enter your first name"}
                        autoCapitalize="words"></TextInput>
                    {(!isProfileNameValid && profileName !== '') && <Text style={styles.validationText}>First Name should not be empty and must not contain numbers or special characters.</Text>}

                </View>
                <View style={styles.content}>
                    <Text style={styles.label}>Last name</Text>
                    <TextInput style={[styles.input, !isLastNameValid && lastName !== '' && { borderColor: 'red' }]}
                        value={lastName}
                        onChangeText={setLastName}
                        keyboardType="default"
                        placeholder={"Please enter your last name"}
                        autoCapitalize="words"></TextInput>
                    {(!isLastNameValid && lastName !== '') && <Text style={styles.validationText}>Last Name should not be empty and must not contain numbers or special characters.</Text>}
                </View>
                <View style={styles.content}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input}
                        value={profileEmail}
                        onChangeText={setProfileEmail}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        placeholder={"Please enter your email"}></TextInput>
                    {(!isEmailValid && profileEmail !== '') && <Text style={styles.validationText}>Please enter a valid email address.</Text>}
                </View>
                <View style={styles.content}>
                    <Text style={styles.label}>Phone number</Text>
                    <MaskedTextInput
                        mask="(999) 999-9999"
                        value={phoneNumber}
                        onChangeText={(_, rawText) => {
                            setPhoneNumber(rawText);
                        }}
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        placeholder={"Please enter your phone number"}
                        maxLength={14}
                        style={styles.input}
                    />
                    {(!isPhoneNumberValid && phoneNumber !== '') && <Text style={styles.validationText}>Please enter a valid phone number.</Text>}
                </View>
                <View style={styles.content}>
                    <Text style={styles.label}>Email notifications</Text>
                    <CheckBox
                        label='Order Status'
                        status={orderStatus ? 'checked' : 'unchecked'}
                        onPress={() => setOrderStatus(!orderStatus)}
                    />
                    <CheckBox
                        label="Password Changes"
                        status={passwordChanges ? 'checked' : 'unchecked'}
                        onPress={() => setPasswordChanges(!passwordChanges)}
                    />
                    <CheckBox
                        label="Special Offers"
                        status={specialOffers ? 'checked' : 'unchecked'}
                        onPress={() => setSpecialOffers(!specialOffers)}
                    />
                    <CheckBox
                        label="Newsletter"
                        status={newsLetters ? 'checked' : 'unchecked'}
                        onPress={() => setNewsLetters(!newsLetters)}
                    />
                </View>
                <View style={styles.content}>
                    <Button onPress={onLogout}
                        pressedStyle={styles.logoutbutton}
                        textStyle={styles.logoutbuttontext}>
                        Log out
                    </Button>
                </View>
                <View style={[styles.avatarview, { gap: 5, paddingHorizontal: 16 }]}>
                    <Button onPress={onDiscardChanges}
                        pressedStyle={[styles.removebutton, { width: '45%' }]}
                        textStyle={styles.removebuttontext}>
                        Discard Changes
                    </Button>
                    <Button onPress={onSaveChanges}
                        pressedStyle={[styles.changebutton, { width: '45%' }]}
                        textStyle={styles.changebuttontext}
                        disabled={!isProfileNameValid || !isLastNameValid || !isEmailValid || !isPhoneNumberValid}
                        disabledStyle={[styles.changebutton, { width: '45%', opacity: 0.5 }]}>
                        Save Changes
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
        gap: 16,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        width: 120,
        height: 60,
        resizeMode: 'contain',
    },
    avatarlogo: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
    },
    avatarview: {
        flexDirection: 'row',
        paddingTop: 16,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    content: {
        paddingHorizontal: 16
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Karla-Regular',
        backgroundColor: 'teal',
        color: 'white',
        paddingVertical: 24,
        paddingHorizontal: 16
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Karla-Regular',
    },
    input: {
        fontSize: 20,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        width: '100%',
        marginVertical: 10,
        color: 'black',
        fontFamily: 'Karla-Regular',
    },
    validationText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: 'red',
        width: '80%',
        fontFamily: 'MarkaziText-Regular',
    },
    changebutton: {
        backgroundColor: 'teal',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        padding: 8,
        elevation: 3,
        width: '35%',
        height: 50,
    },
    changebuttontext: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Karla-Regular',
        fontWeight: 'bold',
    },
    removebutton: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        padding: 8,
        elevation: 3,
        width: '35%',
        height: 50,
        borderColor: 'teal',
        borderWidth: 1,
    },
    removebuttontext: {
        color: 'teal',
        fontSize: 16,
        fontFamily: 'Karla-Regular',
        fontWeight: 'bold',
    },
    logoutbutton: {
        backgroundColor: '#FDDA0D',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        padding: 8,
        elevation: 1,
        width: '100%',
        height: 50,
        borderColor: 'teal',
        borderWidth: 1,
    },
    logoutbuttontext: {
        color: 'teal',
        fontSize: 18,
        fontFamily: 'Karla-Regular',
        fontWeight: 'bold',
    }
});
