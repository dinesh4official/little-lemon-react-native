import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';

interface CheckBoxProps {
    label: string;
    status: 'checked' | 'unchecked';
    onPress: () => void;
}

function CheckBox({ label, status, onPress }: CheckBoxProps) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.view}>
                <Checkbox status={status} color='teal'/>
                <Text style={styles.label}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default CheckBox;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 5,
    },
    view: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    label: {
        fontSize: 16,
        fontWeight: 'semibold',
        fontFamily: 'Karla-Regular',
    },
})