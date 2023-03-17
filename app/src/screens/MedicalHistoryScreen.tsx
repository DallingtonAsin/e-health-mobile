import { useState, useContext, useEffect } from "react";
import { Text, FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { MedicalHistoryRecord } from "../interfaces";
import * as configs from '../configs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome';
import { Context as AppContext } from '../context/appContext';
import { displayMessage } from "../components/common/SharedHelper";
import AppLoader from "../components/AppLoader";


const MedicalHistoryScreen = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryRecord[]>([]);

    const { state, getMedicalHistory } = useContext(AppContext);
    const user = state.user;

    useEffect(() => {
        fetchMedicalHistory();
    }, []);

    const fetchMedicalHistory = () => {
        getMedicalHistory({ patient_id: user.id, onSuccess: populateMedicalHistory, onFailure: displayMessage, onCompletion: stopLoading });
    }

    const populateMedicalHistory = (data: MedicalHistoryRecord[]) => {
        setMedicalHistory(data);
    }

    const stopLoading = () => {
        setIsLoading(false);
    }

    const VerticalLine = () => {
        return (
            <View style={styles.lineContainer}>
                <Icon5 name="dot-circle-o" size={18} color="#999" style={styles.icon} />
                <View style={styles.line} />
            </View>
        );
    };


    const Item = ({ item }: { item: MedicalHistoryRecord }) => (
        <View style={styles.itemContainer}>
            <VerticalLine />
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{item.diagnosis_date}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.historyTitle}>Past Medical History:  <Text style={styles.message}>{item.past_medical_history}</Text> </Text>
                    <Text style={styles.historyTitle}>Previous Treatment:  <Text style={styles.message}>{item.current_treatment}</Text> </Text>
                    <Text style={styles.historyTitle}>illness:  <Text style={styles.message}>{item.illness}</Text> </Text>
                    <Text style={styles.historyTitle}>Treatment:  <Text style={styles.message}>{item.treatment}</Text> </Text>
                </View>
            </View>
        </View>
    );

    const renderItem = ({ item }: { item: MedicalHistoryRecord }) => (
        <Item item={item} />
    );

    const EmptyListComponent = () => (
        <View style={configs.styles.emptyViewContainer}>
            <View style={configs.styles.emptyIconContainer}>
                <Icon name="exclamation-triangle" size={35} color={configs.colors.orange} />
            </View>
            <Text style={configs.styles.noInfoText}>No medical history found</Text>
        </View>
    );

    if (isLoading) {
        return <AppLoader bgColor={configs.colors.white} />
    }

    return (
        <View style={styles.container}>
            {/* <View style={styles.listContainer}> */}
                <FlatList
                    data={medicalHistory}
                    renderItem={renderItem}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyExtractor={(item: MedicalHistoryRecord, index: number) => item.id.toString()}
                    ListEmptyComponent={EmptyListComponent}
                    showsVerticalScrollIndicator={false}
                />
            {/* </View> */}
        </View>

    );
}

export default MedicalHistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },

    listContainer: {
        width: '100%'
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
        // height: 150,
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
        fontWeight: 'bold',
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