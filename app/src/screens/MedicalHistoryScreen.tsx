import React from 'react'
import { Text, View, StyleSheet, StatusBar, useWindowDimensions } from "react-native";
import * as configs from '../configs';
import { TabView } from 'react-native-tab-view'
import { renderTabBar } from '../components/common/tabView'
import CompletedCallsTabScreen from './MedicalHistory/CompletedCallsTabScreen';

const MedicalHistoryScreen = () => {

    const [index, setIndex] = React.useState(0)
    const layout = useWindowDimensions()

    const [routes] = React.useState([
        { key: 'calls', title: 'Calls' },
        { key: 'lab', title: 'Lab' },
        { key: 'diagnosis', title: 'Diagnosis' },
        { key: 'treatment', title: 'Treatment' },
    ])

    const LabTabScreen = () => {
        return (
            <View>
                <Text>Lab Screen</Text>
            </View>
        )
    }

    const DiagnosisTabScreen = () => {
        return (
            <View>
                <Text>Diagnosis Screen</Text>
            </View>
        )
    }

    const TreatmentTabScreen = () => {
        return (
            <View>
                <Text>Treatment Screen</Text>
            </View>
        )
    }

    const CustomRenderScene = ({ route }: { route: any }) => {
        switch (route.key) {
            case 'calls':
                return <CompletedCallsTabScreen />
            case 'lab':
                return <LabTabScreen />
            case 'diagnosis':
                return <DiagnosisTabScreen />
            case 'treatment':
                return <TreatmentTabScreen />
            default:
                return null
        }
    }

    return (
        <View style={styles.container}>

            <StatusBar backgroundColor={configs.colors.primary} />
            <TabView
                navigationState={{ index, routes }}
                renderTabBar={renderTabBar}
                renderScene={CustomRenderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }} />
        </View>

    );
}

export default MedicalHistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
    },

    item: {
        shadowColor: configs.colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        marginVertical: 5,
        marginHorizontal: 16,
        borderRadius: 5,
        backgroundColor: configs.colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        elevation: 5,
    },

    messageContainer: {
        flexGrow: 1,
        maxWidth: '96.5%',
    },

    dotRead: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: configs.colors.gray,
        marginRight: 10,
    },

    dotUnread: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: configs.colors.orange,
        marginRight: 10,
    },

    card: {
        width: '88%',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 5,
        elevation: 3,
    },
    header: {
        backgroundColor: configs.colors.primary,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingVertical: 1,
        paddingHorizontal: 1,
    },
    headerText: {
        fontSize: 14,
        // fontWeight: 'bold',
        color: configs.colors.white,
        marginLeft: 10,
    },

    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 25,
    },

    contentText: {
        fontSize: 14,
    },

    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 5,
    },

    iconContainer: {
        alignItems: 'center',
        marginRight: 5,
    },

    lineContainer: {
        alignItems: 'center',

    },

    line: {
        backgroundColor: configs.colors.primary,
        width: 1,
        height: 40,
    },

    icon: {
        marginTop: -6,
    },

    historyTitle: {
        color: configs.colors.primary,
        fontWeight: '500'
    },

    message: {
        color: configs.colors.dark,
        fontSize: configs.fonts.medium,
        fontWeight: 'normal'

    },
})