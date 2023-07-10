import React, { useEffect, useContext, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { Context as AppContext } from '../../context/appContext'
import { Context as AuthContext } from '../../context/authContext'
import * as configs from '../../configs'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppLoader from '../../components/AppLoader'
import { displayMessage } from '../../components/common/SharedHelper'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const DiagnosisTabScreen = () => {

    const { state } = useContext(AuthContext)
    const user = state.user
    const [isLoading, setIsLoading] = useState(true)
    const [diagnoses, setDiagnoses] = useState<any>([])
    const { getConductedDiagnosis } = useContext(AppContext)
    const navigation = useNavigation<NativeStackNavigationProp<any>>()

    useEffect(() => {
        fetchDiagnoses()
    }, [])

    const fetchDiagnoses = () => {
        getConductedDiagnosis({ is_patient: user.is_patient, onSuccess: populateDiagnoses, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }

    const populateDiagnoses = (data: any) => {
        setDiagnoses(data)
    }

    const gotToCallDetails = (appointment_id: number) => {
        navigation.navigate('AppointmentDetails', { appointment_id: appointment_id })
    }

    const DiagnosisCard = ({ diagnosis }: { diagnosis: any }) => {
        return (
            <View style={styles.diagnosisCard}>
                <Text style={styles.diagnosisTitle}>Diagnosis</Text>
                {diagnosis.map((item: any) => (
                    <View key={item.id} style={styles.diagnosisItem}>
                        <Text style={styles.diagnosisCode}>{item.icd10_code.category_code}</Text>
                        <Text style={styles.diagnosisDescription}>{item.icd10_code.full_description}</Text>
                        <Text style={styles.diagnosisDate}>Date: {item.diagnosis_date}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const DiagnosisCommentsCard = ({ comments }: { comments: any }) => {
        return (
            <View style={styles.diagnosisCommentsCard}>
                <Text style={styles.diagnosisCommentsTitle}>Diagnosis Comments</Text>
                <Text style={styles.diagnosisCommentsText}>{comments}</Text>
            </View>
        );
    };

    const Item = ({ appointment }: { appointment: any }) => (
        <TouchableOpacity style={styles.appointmentContainer} activeOpacity={0.8}>
            <DiagnosisCard diagnosis={appointment.diagnosis} />
            {appointment.diagnosis_comments && (
                <DiagnosisCommentsCard comments={appointment.diagnosis_comments.comments} />
            )}
        </TouchableOpacity>
    )

    const renderItem = ({ item }: { item: any }) => (
        <Item appointment={item} />
    )

    const EmptyListComponent = () => (
        <View style={configs.styles.emptyViewContainer}>
            <View style={configs.styles.emptyIconContainer}>
                <Icon name="exclamation" size={45} color={configs.colors.disabled} />
            </View>
            <Text style={configs.styles.noInfoText}>No diagnosis found</Text>
        </View>
    )

    if (isLoading) {
        return <AppLoader bgColor={configs.colors.white} />
    }

    return (
        <FlatList
            data={diagnoses}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
            keyExtractor={(_, index: number) => index.toString()}
            ListEmptyComponent={EmptyListComponent}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default DiagnosisTabScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    appointmentContainer: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ECECEC',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
        marginVertical: 12,
        marginHorizontal: 10,
    },
    diagnosisCard: {
        marginBottom: 12,
    },
    diagnosisTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    diagnosisItem: {
        backgroundColor: '#F4F4F4',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    diagnosisCode: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    diagnosisDescription: {
        fontSize: 14,
        marginBottom: 2,
    },
    diagnosisDate: {
        fontSize: 14,
        color: 'gray',
    },
    diagnosisCommentsCard: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ECECEC',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
    diagnosisCommentsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    diagnosisCommentsText: {
        fontSize: 14,
    },
})