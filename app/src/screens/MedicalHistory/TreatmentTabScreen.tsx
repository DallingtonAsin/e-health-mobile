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

const TreatmentTabScreen = () => {

    const { state } = useContext(AuthContext)
    const user = state.user
    const [isLoading, setIsLoading] = useState(true)
    const [tests, setTests] = useState<any>([])
    const { getConductedTreatment } = useContext(AppContext)
    const navigation = useNavigation<NativeStackNavigationProp<any>>()

    useEffect(() => {
        fetchTreatments()
    }, [])

    const fetchTreatments = () => {
        getConductedTreatment({ is_patient: user.is_patient, onSuccess: populateTreatments, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }

    const populateTreatments = (data: any) => {
        setTests(data)
    }

    const PrescriptionItem = ({ prescription }: { prescription: any }) => {
        return (
            <View style={styles.prescriptionItemContainer}>
                <Text style={styles.prescriptionItemName}>{prescription.drug.name}</Text>
                <Text style={styles.prescriptionItemDosage}>Dosage: {prescription.dosage}</Text>
                <Text style={styles.prescriptionItemInstructions}>Instructions: {prescription.instructions}</Text>
            </View>
        );
    };

    const Item = ({ appointment }: { appointment: any }) => (
        <TouchableOpacity style={styles.appointmentContainer} activeOpacity={0.8}>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeading}>Prescriptions:</Text>
                {appointment.prescriptions.length > 0 ? (
                    <FlatList
                        data={appointment.prescriptions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <PrescriptionItem prescription={item} />}
                        contentContainerStyle={styles.prescriptionListContainer}
                    />
                ) : (
                    <Text style={styles.noPrescriptionsText}>No prescriptions available</Text>
                )}
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeading}>Treatment Plan:</Text>
                <View style={styles.treatmentPlanContainer}>
                    <Text style={styles.treatmentPlanText}>
                        {appointment.treatment_plan ? appointment.treatment_plan.treatment_plan : 'No treatment plan available'}
                    </Text>
                </View>
            </View>
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
            <Text style={configs.styles.noInfoText}>No treatment found</Text>
        </View>
    )

    if (isLoading) {
        return <AppLoader bgColor={configs.colors.white} />
    }

    return (
        <FlatList
            data={tests}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
            keyExtractor={(_, index: number) => index.toString()}
            ListEmptyComponent={EmptyListComponent}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default TreatmentTabScreen

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
    appointmentNumber: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        color: configs.colors.paleBlue
    },
    appointmentReason: {
        fontSize: 16,
        marginBottom: 4,
    },
    prescriptionListContainer: {
        marginTop: 8,
    },
    appointmentDateTime: {
        fontSize: 14,
    },
    sectionContainer: {
        marginBottom: 16,
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    prescriptionItemContainer: {
        backgroundColor: '#F4F4F4',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    prescriptionItemName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    prescriptionItemDosage: {
        fontSize: 14,
        marginBottom: 2,
    },
    prescriptionItemInstructions: {
        fontSize: 14,
    },
    noPrescriptionsText: {
        marginTop: 8,
        fontStyle: 'italic',
        color: 'gray',
    },
    treatmentPlanContainer: {
        backgroundColor: '#F4F4F4',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    treatmentPlanText: {
        fontSize: 14,
    },
})