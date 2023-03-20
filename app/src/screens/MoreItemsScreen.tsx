import React, { useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as config from '../configs'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import { Context as AppContext } from '../context/appContext';
import * as configs from '../configs';
import CustomStackHeader from '../components/CustomStackHeader';
import { getAppVersion } from '../components/common/SharedHelper';


const MoreItemsScreen = ({ navigation }: { navigation: any }) => {

    const listItems = [
        { id: 1, name: 'My Profile', icon: 'user-circle', isIcon5: true, action: () => navigation.navigate('Profile') },
        { id: 2, name: 'Notifications', icon: 'envelope', isIcon5: true, action: () => navigation.navigate('Notifications') },
        { id: 3, name: 'Help & Support', icon: 'question-circle', isIcon5: true, action: () => navigation.navigate('ContactUs') },
        { id: 4, name: 'Terms & Conditions', icon: 'files-o', isIcon5: false, action: () => navigation.navigate('TermsConditions') },
        { id: 5, name: 'About Us', icon: 'info-circle', isIcon5: false, action: () => navigation.navigate('AboutUs') },
        { id: 6, name: 'Rate Us', icon: 'star', isIcon5: true, action: () => Toast.show('Coming soon...', Toast.LONG) },
        { id: 7, name: 'Signout', icon: 'power-off', isIcon5: true, action: () => signout() },
    ];

    const { signout } = useContext(AppContext);

    const Item = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.item} onPress={item.action}>
            {item.isIcon5
                ? <Icon5 name={item.icon} size={20} color={configs.colors.primary} />
                : <Icon name={item.icon} size={20} color={configs.colors.primary} />
            }
            <Text style={styles.itemTitle}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: any }) => (
        <Item item={item} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <CustomStackHeader title={'Preferences'} onPress={() => { navigation.goBack() }} />
            <View style={styles.body}>
                <FlatList
                    data={listItems}
                    renderItem={renderItem}
                    keyExtractor={(item: any, index: number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={true}
                    ListFooterComponent={<View style={{ height: 40 }} />}
                />
            </View>
            <View style={styles.footer}>
                <Text style={styles.versionText}>Current Version: {getAppVersion()}</Text>
            </View>
        </SafeAreaView>
    )


}

export default MoreItemsScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    body: {
        flex: 4,
        backgroundColor: config.colors.white,
    },

    footer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: config.colors.white,
        marginBottom: 20,
    },

    itemTitle: {
        color: config.colors.black,
        fontSize: configs.fonts.medium,
        left: 12,
    },

    item: {
        backgroundColor: configs.colors.white,
        flexDirection: 'row',
        padding: 20,
        borderTopColor: configs.colors.silver,
        borderBottomColor: configs.colors.silver,
        borderWidth: 0.5,
    },

    versionText: {
        fontSize: config.fonts.medium,
        color: config.colors.primary
    }
});