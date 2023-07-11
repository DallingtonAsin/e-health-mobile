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

const LabTestsTabScreen = () => {

    const { state } = useContext(AuthContext)
    const user = state.user
    const [isLoading, setIsLoading] = useState(true)
    const [tests, setTests] = useState<any>([])
    const { getConductedTests } = useContext(AppContext)
    const navigation = useNavigation<NativeStackNavigationProp<any>>()

    useEffect(() => {
        fetchTests()
    }, [])

    const fetchTests = () => {
        getConductedTests({ is_patient: user.is_patient, onSuccess: populateTests, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }

    const populateTests = (data: any) => {
        setTests(data)
    }

    const LabTestItem = ({ labTest }: { labTest: any }) => {
        return (
            <View style={styles.labTestItem}>
                <Text style={styles.labTestCode}>{labTest.lab_test_category.code}</Text>
                <Text style={styles.labTestName}>{labTest.lab_test_category.name}</Text>
                <Text style={styles.labTestFindings}>{labTest.findings}</Text>
            </View>
        )
    }

    const ImageTestItem = ({ imageTest }: { imageTest: any }) => {
        return (
            <View style={styles.imageTestItem}>
                <Text style={styles.imageTestCode}>{imageTest.image_test_category.code}</Text>
                <Text style={styles.imageTestName}>{imageTest.image_test_category.name}</Text>
                <Text style={styles.imageTestFindings}>{imageTest.findings}</Text>
            </View>
        )
    }

    const OtherTestsCard = ({ otherTests }: { otherTests: any }) => {
        return (
            <View style={styles.otherTestsCard}>
                <Text style={styles.otherTestsTitle}>Other Tests</Text>
                <Text style={styles.otherTestsText}>{otherTests.tests}</Text>
                <Text style={styles.otherTestsText}>Findings: {otherTests.findings}</Text>
            </View>
        )
    }

    const TestsCard = ({ labTests, imageTests, otherTests }: { labTests: any, imageTests: any, otherTests: any }) => {
        return (
            <View style={styles.testsCard}>
                <Text style={styles.testsTitle}>Lab Tests</Text>
                {labTests.length > 0 ? (
                    <FlatList
                        data={labTests}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <LabTestItem labTest={item} />}
                        contentContainerStyle={styles.testsListContainer}
                    />
                ) : (
                    <Text style={styles.noTestsText}>No lab tests available</Text>
                )}
                <Text style={[styles.testsTitle, { marginTop: 16 }]}>Image Tests</Text>
                {imageTests.length > 0 ? (
                    <FlatList
                        data={imageTests}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <ImageTestItem imageTest={item} />}
                        contentContainerStyle={styles.testsListContainer}
                    />
                ) : (
                    <Text style={styles.noTestsText}>No image tests available</Text>
                )}
                {otherTests && (
                    <OtherTestsCard otherTests={otherTests} />
                )}
            </View>
        )
    }

    const handlePress = (appointment_id: number) => {
        navigation.navigate('AppointmentDetails', { appointment_id: appointment_id })
    }

    const AppointmentDetails = ({ appointment }: { appointment: any }) => {
        return (
            <TouchableOpacity style={styles.appointmentContainer} activeOpacity={0.8} onPress={() => handlePress(appointment.id)}>
                <TestsCard
                    labTests={appointment.lab_tests}
                    imageTests={appointment.image_tests}
                    otherTests={appointment.other_tests}
                />
            </TouchableOpacity>
        )
    }

    const EmptyListComponent = () => (
        <View style={configs.styles.emptyViewContainer}>
            <View style={configs.styles.emptyIconContainer}>
                <Icon name="exclamation" size={45} color={configs.colors.disabled} />
            </View>
            <Text style={configs.styles.noInfoText}>No lab tests found</Text>
        </View>
    )

    if (isLoading) {
        return <AppLoader bgColor={configs.colors.white} />
    }

    return (
        <FlatList
            data={tests}
            renderItem={({ item }) => <AppointmentDetails appointment={item} />}
            contentContainerStyle={{ flexGrow: 1 }}
            keyExtractor={(_, index: number) => index.toString()}
            ListEmptyComponent={EmptyListComponent}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default LabTestsTabScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    appointmentContainer: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
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
        marginBottom: 4,
    },
    appointmentReason: {
        fontSize: 16,
        marginBottom: 4,
    },
    appointmentDateTime: {
        fontSize: 14,
    },
    testsCard: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        // padding: 16,
        marginBottom: 16,
    },
    testsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    labTestItem: {
        backgroundColor: '#F4F4F4',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    labTestCode: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    labTestName: {
        fontSize: 14,
        marginBottom: 2,
    },
    labTestFindings: {
        fontSize: 14,
        color: 'gray',
    },
    imageTestItem: {
        backgroundColor: '#F4F4F4',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    imageTestCode: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    imageTestName: {
        fontSize: 14,
        marginBottom: 2,
    },
    imageTestFindings: {
        fontSize: 14,
        color: 'gray',
    },
    noTestsText: {
        marginTop: 8,
        fontStyle: 'italic',
        color: 'gray',
    },
    otherTestsCard: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ECECEC',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5
    },
    otherTestsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    otherTestsText: {
        fontSize: 14,
    },
    testsListContainer: {
        flexGrow: 1,
    },
})