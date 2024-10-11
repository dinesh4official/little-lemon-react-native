import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
    return (
        <View style={styles.filtersContainer}>
            {sections.map((section, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        onChange(index);
                    }}
                    style={[styles.opacityContainer, {
                        flex: 1 / sections.length,
                        backgroundColor: selections[index] ? '#b7ddb0' : 'grey',
                    }
                    ]}>
                    <View>
                        <Text style={[styles.text, { color: selections[index] ? 'teal' : 'white' }]} ellipsizeMode='tail'>
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    filtersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 2,
    },
    opacityContainer: {
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: 'white',
    },
    text: {
        fontWeight: 'bold',
        fontFamily: 'Karla-Regular',
    },
});

export default Filters;
