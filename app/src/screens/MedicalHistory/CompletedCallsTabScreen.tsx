import React, { useEffect, useContext, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Context as AppContext } from '../../context/appContext';
import { Context as AuthContext } from '../../context/authContext';
import * as configs from '../../configs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome';
import AppLoader from '../../components/AppLoader';
import { displayMessage } from '../../components/common/SharedHelper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const CompletedCallsTabScreen = () => {

    const { state } = useContext(AuthContext);
    const user = state.user;
    const [isLoading, setIsLoading] = useState(true);
    const [heldCalls, setHeldCalls] = useState<any>([]);
    const { getHeldAppointments } = useContext(AppContext);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        fetchHistoryCalls();
    }, []);

    const fetchHistoryCalls = () => {
        getHeldAppointments({ is_patient: user.is_patient, onSuccess: populateHeldCalls, onFailure: displayMessage, onCompletion: () => setIsLoading(false) });
    }

    const populateHeldCalls = (data: any) => {
        setHeldCalls(data);
    }

    const gotToCallDetails = (appointment_id: number) => {
        navigation.navigate('AppointmentDetails', { appointment_id: appointment_id })
    }

    const VerticalLine = () => {
        return (
            <View style={styles.lineContainer}>
                <Icon5 name="dot-circle-o" size={18} color="#999" style={styles.icon} />
                <View style={styles.line} />
            </View>
        );
    };

    const Item = ({ item }: { item: any }) => (
        <View style={styles.itemContainer}>
            <VerticalLine />
            <TouchableOpacity style={styles.card} onPress={() => gotToCallDetails(item.id)}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{item.diagnosis_date}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.historyTitle}>Call Type:  <Text style={styles.message}>{item.appointment_type.name}</Text> </Text>
                    <Text style={styles.historyTitle}>Start Date:  <Text style={styles.message}>{item.held_call.start_time}</Text> </Text>
                    <Text style={styles.historyTitle}>End Date:  <Text style={styles.message}>{item.held_call.end_time}</Text> </Text>
                    <Text style={styles.historyTitle}>Duration:  <Text style={styles.message}>{item.held_call.duration}</Text> </Text>
                    <Text style={styles.historyTitle}>Reason:  <Text style={styles.message}>{item.reason}</Text> </Text>
                    {/* <Text style={styles.historyTitle}>History Comments:  <Text style={styles.message}>{item.treatment}</Text> </Text> */}
                </View>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: { item: any }) => (
        <Item item={item} />
    );

    const EmptyListComponent = () => (
        <View style={configs.styles.emptyViewContainer}>
            <View style={configs.styles.emptyIconContainer}>
                <Icon name="exclamation" size={45} color={configs.colors.disabled} />
            </View>
            <Text style={configs.styles.noInfoText}>No history calls found</Text>
        </View>
    );

    if (isLoading) {
        return <AppLoader bgColor={configs.colors.white} />
    }

    return (
        <FlatList
            data={heldCalls}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
            keyExtractor={(_, index: number) => index.toString()}
            ListEmptyComponent={EmptyListComponent}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default CompletedCallsTabScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
    },
    card: {
        width: '88%',
        backgroundColor: configs.colors.white,
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 5,
        elevation: 3,
    },
    header: {
        backgroundColor: configs.colors.paleBlue,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingVertical: 1,
        paddingHorizontal: 1,
    },
    headerText: {
        fontSize: 14,
        color: configs.colors.white,
        marginLeft: 10,
    },

    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 25,
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
        color: configs.colors.primaryBlue
    },

    message: {
        color: configs.colors.dark,
        fontSize: configs.fonts.medium,
        fontWeight: 'normal'

    }
});