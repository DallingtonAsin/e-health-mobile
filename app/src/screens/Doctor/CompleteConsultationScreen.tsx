import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar, StyleSheet, useWindowDimensions, FlatList } from 'react-native'
import * as config from '../../configs'
import AppLoader from '../../components/AppLoader'
import { displayMessage } from '../../components/common/SharedHelper'
import { Context as DoctorContext } from '../../context/doctorContext'
import { Option, ILabTest, IMedicalHistData, ISelectItem } from '../../interfaces'
import { TabView, SceneMap } from 'react-native-tab-view'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import { renderTable } from '../../components/common/lab/dataTable'
import { CustomAddTestModal, OtherTestsModal, handleAddTest } from '../../components/common/lab/customLabTestsModals'
import HistoryTabScreen from '../Lab/HistoryTabScreen'
import DiagnosisTabScreen from '../Lab/DiagnosisTabScreen'
import TreatmentTabScreen from '../Lab/TreatmentTabScreen'
import { InitialMedicalHistData } from '../../configs/constants'
import { renderTabBar } from '../../components/common/tabView'
import { ScrollView } from 'react-native-gesture-handler'

const CompleteConsultationScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointment_id, patient } = route.params
    const { completeAppointment } = useContext(DoctorContext)

    const [isLoading, setIsLoading] = useState(false)
    const [icd10Codes, setIcd10Codes] = useState<ISelectItem[] | any>()
    const [labTestCategories, setLabTestCategories] = useState<Option[] | any>()
    const [imageTestCategories, setImageTestCategories] = useState<Option[] | any>()

    // history data
    const [historyInfo, setHistoryInfo] = useState<IMedicalHistData>(InitialMedicalHistData)

    // Lab tests data
    const [recordedLabTests, setRecordedLabTests] = useState<ILabTest[]>([])
    const [recordedImageTests, setRecordedImageTests] = useState<ILabTest[]>([])
    const [recordedOtherTests, setRecordedOtherTests] = useState<string>('')
    const [otherTestFindings, setOtherTestFindings] = useState<string>('')

    // daiagnosis daat
    const [selectedIcdCodes, setSelectedIcdCodes] = useState<string[]>([])
    const [diagnosisComments, setDiagnosisComments] = useState<string>('')

    // Treatment plan data
    const [recordedDrugs, setRecordedDrugs] = useState<any>([])
    const [treatmentPlan, setTreatmentPlan] = useState<any>()

    const [isFetchingIcdCodes, setFetchingIcdCodes] = useState(true)
    const [isFetchingLabTests, setIsFetchingLabTests] = useState(true)
    const [isFetchingImageTests, setIsFetchingImageTests] = useState(true)

    const [index, setIndex] = React.useState(0)
    const layout = useWindowDimensions()

    const { getIcd10Codes, getLabTestCategories, getImageTestCategories } = useContext(DoctorContext)

    useEffect(() => {
        getIcd10Codes({ onSuccess: populateIcd10Codes, onFailure: displayMessage, onCompletion: () => setFetchingIcdCodes(false) })
        getLabTestCategories({ onSuccess: populateLabCategories, onFailure: displayMessage, onCompletion: () => setIsFetchingLabTests(false) })
        getImageTestCategories({ onSuccess: populateImageCategories, onFailure: displayMessage, onCompletion: () => setIsFetchingImageTests(false) })
    }, [])


    const populateIcd10Codes = (data: ISelectItem[]) => {
        setIcd10Codes(data)
    }

    const populateLabCategories = (data: Option[]) => {
        setLabTestCategories(data)
    }

    const populateImageCategories = (data: Option[]) => {
        setImageTestCategories(data)
    }

    const onSelectICDCode = (newArray: string[]) => {
        const oldArray = selectedIcdCodes
        newArray.forEach((element) => {
            if (!oldArray.includes(element)) {
                oldArray.push(element);
            }
        });
        oldArray.forEach((element, index) => {
            if (!newArray.includes(element)) {
                oldArray.splice(index, 1);
            }
        });
        setSelectedIcdCodes(oldArray)
    }

    const [routes] = React.useState([
        { key: 'history', title: 'History' },
        { key: 'lab', title: 'Lab' },
        { key: 'diagnosis', title: 'Diagnosis' },
        { key: 'treatment', title: 'Treatment' },
    ])

    const submit = () => {

        if (!historyInfo?.presenting_complaint) {
            displayMessage("Please enter presenting complaint")
            return
        }
        if (!historyInfo.past_medical_history) {
            displayMessage("Please enter past medical history")
            return
        }
        if (!historyInfo.drug_allergies) {
            displayMessage("Please enter drug allergies")
            return
        }
        if (!historyInfo.findings) {
            displayMessage("Please enter findings")
            return
        }

        const payload = {
            patient_id: patient.id,
            presenting_complaint: historyInfo.presenting_complaint,
            past_medical_history: historyInfo.past_medical_history,
            drug_allergies: historyInfo.drug_allergies,
            findings: historyInfo.findings
        }
        setIsLoading(true)
        completeAppointment({ appointment_id: appointment_id, payload: payload, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }

    const onSuccess = (message: string) => {
        displayMessage(message)
        navigation.navigate('MyAppointments')
    }

    const LabTabScreen = () => {
        const [selectedLabTestItem, setSelectedLabTestItem] = useState<string>('')
        const [selectedImageTestItem, setSelectedImageTestItem] = useState<string>('')

        const [labTestFindings, setLabTestFindings] = useState('')
        const [imageTestFindings, setImageTestFindings] = useState('')

        const [isLabTestModalVisible, setIsLabTestModalVisible] = useState(false)
        const [isImageTestModalVisible, setIsImageTestModalVisible] = useState(false)
        const [isotherTestModalVisible, setIsOtherTestModalVisible] = useState(false)

        const toggleLabTestModal = () => setIsLabTestModalVisible(!isLabTestModalVisible)
        const toggleImageTestModal = () => setIsImageTestModalVisible(!isImageTestModalVisible)
        const toggleOtherTestModal = () => setIsOtherTestModalVisible(!isotherTestModalVisible)

        const tests = [
            { id: 1, text: 'Add lab tests', action: toggleLabTestModal },
            { id: 2, text: 'Add image tests', action: toggleImageTestModal },
            { id: 3, text: 'Add other tests', action: toggleOtherTestModal }
        ]

        const handleLabTestItemSelect = (item: any) => {
            setSelectedLabTestItem(item)
        }

        const handleImageTestItemSelect = (item: any) => {
            setSelectedImageTestItem(item)
        }

        const handleBackdropPress = () => {
            setIsLabTestModalVisible(true)
        }

        const renderItem = ({ item }: { item: any }) => (
            <TouchableOpacity style={styles.item} onPress={item.action}>
                <Text style={styles.itemTitle}>{item.text}</Text>
                <Icon5 name="angle-right" size={20} color={config.colors.primary} style={styles.arrow} />
            </TouchableOpacity>
        )

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <FlatList
                        data={tests}
                        renderItem={renderItem}
                        keyExtractor={(_, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={true}
                        style={{ top: 5 }} />
                </View>

                <ScrollView
                    style={{ marginBottom: 20 }}
                    contentContainerStyle={{ flexGrow: 1, top: 10 }}>
                    {renderTable(recordedLabTests, 'Lab Tests')}
                    {renderTable(recordedImageTests, 'Image Tests')}
                </ScrollView>

                <CustomAddTestModal
                    items={labTestCategories}
                    isVisible={isLabTestModalVisible}
                    findingsText={labTestFindings}
                    modalTitle={"Enter labtests carried out"}
                    selectTitle={"Select LabTest"}
                    findingsTitle={"LabTest Findings"}
                    textInputLabel={"Lab test findings"}
                    toggleModal={toggleLabTestModal}
                    handleBackdropPress={handleBackdropPress}
                    handleItemSelect={handleLabTestItemSelect}
                    setFindingsText={setLabTestFindings}
                    onSubmit={() => handleAddTest(selectedLabTestItem, labTestFindings, recordedLabTests, setRecordedLabTests, () => setLabTestFindings(''))} />

                <CustomAddTestModal
                    items={imageTestCategories}
                    isVisible={isImageTestModalVisible}
                    findingsText={imageTestFindings}
                    modalTitle={"Enter imagetests carried out"}
                    selectTitle={"Select ImageTest"}
                    findingsTitle={"ImageTest Findings"}
                    textInputLabel={"Image test findings"}
                    toggleModal={toggleImageTestModal}
                    handleBackdropPress={handleBackdropPress}
                    handleItemSelect={handleImageTestItemSelect}
                    setFindingsText={setImageTestFindings}
                    onSubmit={() => handleAddTest(selectedImageTestItem, imageTestFindings, recordedImageTests, setRecordedImageTests, () => setImageTestFindings(''))} />

                <OtherTestsModal
                    modalTitle={"Enter other tests information"}
                    isVisible={isotherTestModalVisible}
                    toggleModal={toggleOtherTestModal}
                    otherTests={recordedOtherTests}
                    setOtherTests={setRecordedOtherTests}
                    otherTestFindings={otherTestFindings}
                    setOtherTestFindings={setOtherTestFindings} />

            </SafeAreaView>
        )
    }

    const renderScene = SceneMap({
        history: () => <HistoryTabScreen historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} />,
        lab: LabTabScreen,
        diagnosis: () => <DiagnosisTabScreen
            icd10Codes={icd10Codes}
            onSelect={onSelectICDCode}
            comments={diagnosisComments}
            setComments={setDiagnosisComments}
        />,
        treatment: () => <TreatmentTabScreen
            recordedDrugs={recordedDrugs}
            setRecordedDrugs={setRecordedDrugs}
            treatmentPlan={treatmentPlan}
            setTreatmentPlan={setTreatmentPlan}
        />
    })

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={config.colors.primary} />
            <TabView
                navigationState={{ index, routes }}
                renderTabBar={renderTabBar}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }} />
            <View style={styles.footer}>
                <TouchableOpacity style={[config.styles.primaryBtn, { width: '100%', marginBottom: 20 }]}
                    onPress={() => submit()}>
                    <Text style={[config.styles.btnText, { color: config.colors.white }]}>Submit</Text>
                </TouchableOpacity>
            </View>
            {(isLoading || isFetchingLabTests || isFetchingIcdCodes || isFetchingImageTests) && <AppLoader />}
        </View>
    )
}

export default CompleteConsultationScreen

const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    viewContainer: {
        marginVertical: 5,
        paddingHorizontal: 10
    },

    footer: {
        marginHorizontal: 12,
    },

    labelTxt: {
        fontSize: config.fonts.normal,
        color: config.colors.black
    },

    textInput: {
        backgroundColor: config.colors.white,
        color: config.colors.silver,
        fontSize: config.fonts.normal
    },

    item: {
        shadowColor: config.colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        marginVertical: 5,
        marginHorizontal: 16,
        borderRadius: 5,
        backgroundColor: config.colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 18,
        elevation: 5,
    },

    itemTitle: {
        color: '#000',
        fontSize: config.fonts.medium,
    },

    arrow: {
        right: 0
    }
})