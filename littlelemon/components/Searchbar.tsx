import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface SearchbarProps {
    placeholder?: string;
    onChangeText?: (text: string) => void;
    style?: object;
}

const Searchbar = ({ placeholder = "Search...", onChangeText, style }: SearchbarProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const animationValue = useRef(new Animated.Value(0)).current;
    const [query, setQuery] = useState('');

    const handleSearchIconClick = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            Animated.timing(animationValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(animationValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
            }).start();
        }
    };

    const handleInputChange = (text: string) => {
        setQuery(text);
        if (onChangeText) {
            onChangeText(text);
        }
    };

    return (
        <View style={[styles.searchbar, isExpanded && styles.expanded, style]}>
            <TouchableOpacity onPress={handleSearchIconClick}>
                <FontAwesome name="search" size={28} color="white" />
            </TouchableOpacity>
            {isExpanded && (
                <TextInput
                    style={styles.searchInput}
                    value={query}
                    onChangeText={handleInputChange}
                    placeholder={placeholder}
                    placeholderTextColor="white"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchbar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    expanded: {
        width: '100%',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        padding: 10,
        borderWidth: 2,
        fontSize: 16,
        borderColor: 'white',
        borderRadius: 8,
        color: 'white',
    },
});

export default Searchbar;