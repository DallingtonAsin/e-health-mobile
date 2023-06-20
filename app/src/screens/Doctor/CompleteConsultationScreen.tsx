import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar, StyleSheet, useWindowDimensions, FlatList, Alert } from 'react-native'
import * as config from '../../configs'
import AppLoader from '../../components/AppLoader'
import { displayMessage } from '../../components/common/SharedHelper'
import { Context as DoctorContext } from '../../context/doctorContext'
import { Option, ILabTest, IMedicalHistData, ISelectItem, IPrescriptionDrug, IDiagnosisData, ITreatmentPlanData, ILabTestData } from '../../interfaces'
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
import { validateDiagnosisData, validateMedicalHistData, validateTreatmentPlanData } from '../../components/common/validation'

const CompleteConsultationScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointment_id } = route.params
    const { getAppointmentPostConsultationData, completeConsultation } = useContext(DoctorContext)

    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingConsultData, setFetchingConsultData] = useState(true)
    const [isFetchingIcdCodes, setFetchingIcdCodes] = useState(true)
    const [isFetchingLabTests, setIsFetchingLabTests] = useState(true)
    const [isFetchingImageTests, setIsFetchingImageTests] = useState(true)

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
    const [recordedDrugs, setRecordedDrugs] = useState<IPrescriptionDrug[]>([])
    const [treatmentPlan, setTreatmentPlan] = useState<string>('')


    const [index, setIndex] = React.useState(0)
    const layout = useWindowDimensions()

    const { getIcd10Codes, getLabTestCategories, getImageTestCategories } = useContext(DoctorContext)

    useEffect(() => {
        getAppointmentPostConsultationData({ appointment_id: appointment_id, onSuccess: populateConsulationData, onFailure: displayMessage, onCompletion: () => setFetchingConsultData(false) })
        getIcd10Codes({ onSuccess: populateIcd10Codes, onFailure: displayMessage, onCompletion: () => setFetchingIcdCodes(false) })
        getLabTestCategories({ onSuccess: populateLabCategories, onFailure: displayMessage, onCompletion: () => setIsFetchingLabTests(false) })
        getImageTestCategories({ onSuccess: populateImageCategories, onFailure: displayMessage, onCompletion: () => setIsFetchingImageTests(false) })
    }, [])

    const populateConsulationData = (data: any) => {
        setHistoryInfo(data.medical_history)
        setRecordedLabTests(data.lab_tests)
        setRecordedImageTests(data.image_tests)
        setRecordedOtherTests(data.other_tests.tests)
        setOtherTestFindings(data.other_tests.findings)
        setSelectedIcdCodes(data.diagnosisIcdCodes)
        setDiagnosisComments(data.diagnosis_comments.comments)
        setRecordedDrugs(data.prescriptions)
        setTreatmentPlan(data.treatment_plan.treatment_plan)
    }

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

    const submit = (isDraft: boolean = true) => {

        const histDataError = validateMedicalHistData(historyInfo)
        if (histDataError) {
            displayMessage(histDataError)
            return
        }
        const diagnosisData: IDiagnosisData = {
            icd10Codes: selectedIcdCodes,
            comments: diagnosisComments
        }
        const diagnosisDataError = validateDiagnosisData(diagnosisData)
        if (diagnosisDataError) {
            displayMessage(diagnosisDataError)
            return
        }

        const treatmentPlanData: ITreatmentPlanData = {
            drugs: recordedDrugs,
            treatmentPlan: treatmentPlan
        }
        const treatmentDataError = validateTreatmentPlanData(treatmentPlanData)
        if (treatmentDataError) {
            displayMessage(treatmentDataError)
            return
        }

        const labTestData: ILabTestData = {
            labTests: recordedLabTests,
            imageTests: recordedImageTests,
            otherTests: recordedOtherTests,
            otherTestFindings: otherTestFindings
        }

        if (isDraft) {
            submitPostConsultationData(isDraft, labTestData, diagnosisData, treatmentPlanData)
        } else {
            confirmBeforeSubmitting(isDraft, labTestData, diagnosisData, treatmentPlanData)
        }
    }

    const submitPostConsultationData = (isDraft: boolean, labTestData: ILabTestData, diagnosisData: IDiagnosisData, treatmentData: ITreatmentPlanData) => {

        console.log(`is draft`, isDraft)
        console.log(`History data`, historyInfo)
        console.log(`Labtest data`, labTestData)
        console.log(`Diagnosis data`, diagnosisData)
        console.log(`Treatment data`, treatmentData)
        const payload = {
            appointmentId: appointment_id,
            isDraft: isDraft,
            historyData: historyInfo,
            labTestData: labTestData,
            diagnosisData: diagnosisData,
            treatmentData: treatmentData,
        }
        console.log(`Payload data`, payload)
        setIsLoading(true)
        completeConsultation({ appointment_id: appointment_id, payload: payload, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }

    const confirmBeforeSubmitting = (isDraft: boolean, labTestData: ILabTestData, diagnosisData: IDiagnosisData, treatmentData: ITreatmentPlanData) => {
        const message = `Are you sure you want to complete this appointment now?`
        Alert.alert(
            `Confirm submission`,
            message,
            [
                { text: 'No', onPress: () => { } },
                {
                    text: 'Yes', onPress: () => {
                        submitPostConsultationData(isDraft, labTestData, diagnosisData, treatmentData)
                    }
                },
            ],
            { cancelable: false }
        );
    }

    const onSuccess = (message: string) => {
        displayMessage(message)
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
                    textInputLabel={"Enter outcome or test result value(s)"}
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
                    textInputLabel={"Enter outcome or test result value(s)"}
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

    const CustomRenderScene = ({ route }: {route: any}) => {
        switch (route.key) {
          case 'history':
            return <HistoryTabScreen historyInfo={historyInfo} setHistoryInfo={setHistoryInfo}/>;
          case 'lab':
            return <LabTabScreen/>;
          case 'diagnosis':
            return <DiagnosisTabScreen icd10Codes={icd10Codes} onSelect={onSelectICDCode}  comments={diagnosisComments} setComments={setDiagnosisComments} />;
          case 'treatment':
                return <TreatmentTabScreen recordedDrugs={recordedDrugs} setRecordedDrugs={setRecordedDrugs}  treatmentPlan={treatmentPlan} setTreatmentPlan={setTreatmentPlan}/>;
          default:
            return null;
        }
      };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={config.colors.primary} />
            <TabView
                navigationState={{ index, routes }}
                renderTabBar={renderTabBar}
                renderScene={CustomRenderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }} />
            <View style={styles.footer}>

                <TouchableOpacity style={[config.styles.secondaryBtn, { width: '100%', marginBottom: 10 }]}
                    onPress={() => submit(true)}>
                    <Text style={[config.styles.btnText, { color: config.colors.primary }]}>Save as Draft</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[config.styles.primaryBtn, { width: '100%', marginBottom: 10 }]}
                    onPress={() => submit(false)}>
                    <Text style={[config.styles.btnText, { color: config.colors.white }]}>Submit</Text>
                </TouchableOpacity>
            </View>
            {(isLoading || isFetchingConsultData || isFetchingLabTests || isFetchingIcdCodes || isFetchingImageTests) && <AppLoader />}
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