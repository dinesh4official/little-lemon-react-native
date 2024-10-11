import { NavigationProp } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View, Image, SafeAreaView, Text, FlatList, StatusBar, Pressable } from 'react-native';
import Searchbar from '../components/Searchbar';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { createTable, filterByQueryAndCategories, getMenuItems, saveMenuItems } from '../database';
import Filters from '../components/Filters';
import { ProfileData, useUpdateEffect } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }: { navigation: NavigationProp<any> } = { navigation: {} as NavigationProp<any> }) {

    const sections = ['starters', 'mains', 'desserts', 'drinks'];
    const dataAPI = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

    const [menuItems, setMenuItems] = React.useState<{ name: string; price: number; description: string; image: string; category: string; }[]>([]);
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [filterSelections, setFilterSelections] = React.useState(
        sections.map(() => false)
    );

    const lookup = React.useCallback((q: string) => {
        setSearchQuery(q);
    }, []);

    const debouncedLookup = React.useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = async (text: string) => {
        setSearchQuery(text);
        debouncedLookup(text);
    };

    const fetchData = async () => {
        try {
            await createTable();
            const items = await getMenuItems() as { name: string; price: number; description: string; image: string; category: string; }[];

            if (!items.length) {
                const response = await axios.get(dataAPI);
                const fetchedItems = response.data.menu as { name: string; price: number; description: string; image: string; category: string; }[];
                saveMenuItems(fetchedItems);
                setMenuItems(fetchedItems);
            } else {
                setMenuItems(items);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const layoutHeader = (async () => {
        const profileData = await AsyncStorage.getItem('profileData');
        const data: ProfileData = profileData ? JSON.parse(profileData) : null;

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
            headerRight: () => (
                <View style={{ paddingRight: 8 }}>
                    <Pressable onPress={() => navigation.navigate('Profile')}>
                        <Image
                            source={
                                data && data.profileImage
                                    ? { uri: data.profileImage }
                                    : require("../images/profile.png")
                            }
                            style={styles.avatarlogo}
                        />
                    </Pressable>
                </View>
            )
        });
    });

    React.useLayoutEffect(() => {
        layoutHeader();
    }, [navigation]);

    useUpdateEffect(() => {
        (async () => {
            const activeCategories = sections.filter((s, i) => {
                if (filterSelections.every((item) => item === false)) {
                    return true;
                }
                return filterSelections[i];
            });
            try {
                const menuItems = await filterByQueryAndCategories(
                    searchQuery,
                    activeCategories
                );
                setMenuItems(menuItems as { name: string; price: number; description: string; image: string; category: string; }[]);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [filterSelections, searchQuery]);

    const handleFiltersChange = async (index: number) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.cardtitle}>Little Lemon</Text>
                <Text style={styles.cardlocation}>Chicago</Text>
                <View style={styles.carddescriptionview}>
                    <Text style={styles.carddescription}>We are a family owned Mediterranean resturant, focused on traditional receipes served with a modern twist.</Text>
                    <Image style={styles.cardImage} source={require("../images/heroimage.png")}></Image>
                </View>
                <Searchbar placeholder="Search" onChangeText={handleSearchChange} />
            </View>
            <View style={styles.section}>
                <Text style={[styles.cardtitle, { color: 'black' }]}>ORDER FOR DELIVERY!</Text>
                <Filters
                    selections={filterSelections}
                    onChange={handleFiltersChange}
                    sections={sections}
                />
                <View style={styles.horizontalline} />
            </View>
            {(!menuItems || menuItems.length === 0) && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>No menu items available. Please try again later.</Text>
                </View>
            )}
            <FlatList style={{ flex: 1 }}
                data={menuItems}
                keyExtractor={(item, index) => item.name + index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.flatcard}>
                        <View style={styles.flatsubcard}>
                            <Image
                                style={styles.flatcardimage}
                                source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true` }}
                                defaultSource={require('../images/profile.png')}
                            />
                            <View style={styles.flatcarditem}>
                                <Text style={styles.flatcardtitle}>{item.name}</Text>
                                <Text style={styles.flatcarddescription} numberOfLines={2} ellipsizeMode='tail'>{item.description}</Text>
                                <Text style={styles.flatcarddescription} numberOfLines={1}>${item.price.toFixed(2)}</Text>
                            </View>
                        </View>
                        <View style={[styles.horizontalline, { opacity: 0.5, marginBottom: 0, marginVertical: 8, backgroundColor: 'red' }]} />
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    avatarlogo: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
    },
    logo: {
        width: 120,
        height: 60,
        resizeMode: 'contain',
    },
    card: {
        backgroundColor: 'teal',
        padding: 16,
    },
    cardtitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FDDA0D',
        fontFamily: 'Karla-Regular',
    },
    cardlocation: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Karla-Regular',
    },
    carddescriptionview: {
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '70%',
        gap: 5,
    },
    cardImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        backgroundColor: 'white',
    },
    carddescription: {
        fontSize: 16,
        fontWeight: 'semibold',
        color: 'white',
        fontFamily: 'Karla-Regular',
    },
    section: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    horizontalline: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginBottom: 5,
    },
    flatcard: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    flatsubcard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    flatcardimage: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
    },
    flatcarditem: {
        gap: 12,
        width: '70%',
    },
    flatcardtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Karla-Regular',
    },
    flatcarddescription: {
        fontSize: 16,
        color: 'grey',
        fontFamily: 'Karla-Regular',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
    },
});
