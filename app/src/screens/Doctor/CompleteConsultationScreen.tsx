import React, { useState, useContext, useEffect } from 'react'
import * as config from '../../configs'
import AppLoader from '../../components/AppLoader'
import { TabView } from 'react-native-tab-view'
import HistoryTabScreen from '../Lab/HistoryTabScreen'
import { ScrollView } from 'react-native-gesture-handler'
import DiagnosisTabScreen from '../Lab/DiagnosisTabScreen'
import TreatmentTabScreen from '../Lab/TreatmentTabScreen'
import { renderTabBar } from '../../components/common/tabView'
import { InitialMedicalHistData } from '../../configs/constants'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import { renderTable } from '../../components/common/lab/dataTable'
import { displayMessage } from '../../components/common/SharedHelper'
import { Context as DoctorContext } from '../../context/doctorContext'
import { CustomAddTestModal, OtherTestsModal, handleAddTest } from '../../components/common/lab/customLabTestsModals'
import { validateDiagnosisData, validateMedicalHistData, validateTreatmentPlanData } from '../../components/common/validation'
import DocumentPicker, { isCancel, isInProgress, types } from 'react-native-document-picker'
import { Option, ILabTest, IMedicalHistData, ISelectItem, IPrescriptionDrug, IDiagnosisData, ITreatmentPlanData, ILabTestData, UploadedFile } from '../../interfaces'
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar, StyleSheet, useWindowDimensions, FlatList, Alert, Image } from 'react-native'
var RNFS = require('react-native-fs')
import PDFView from 'react-native-pdf'


const CompleteConsultationScreen = ({ route }: { route: any }) => {

    const { appointment_id } = route.params
    const { getAppointmentPostConsultationData, completeConsultation } = useContext(DoctorContext)

    const [isLoading, setIsLoading] = useState(false)
    const [isAppointmentDraft, setIsAppointmentDraft] = useState(true)
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

    // daiagnosis data
    const [selectedIcdCodes, setSelectedIcdCodes] = useState<string[]>([])
    const [diagnosisComments, setDiagnosisComments] = useState<string>('')

    // Treatment plan data
    const [recordedDrugs, setRecordedDrugs] = useState<IPrescriptionDrug[]>([])
    const [treatmentPlan, setTreatmentPlan] = useState<string>('')
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

    const [index, setIndex] = React.useState(0)
    const layout = useWindowDimensions()

    const { getIcd10Codes, getLabTestCategories, getImageTestCategories } = useContext(DoctorContext)

    useEffect(() => {
        getConsultationData()
        getIcd10Codes({ onSuccess: populateIcd10Codes, onFailure: displayMessage, onCompletion: () => setFetchingIcdCodes(false) })
        getLabTestCategories({ onSuccess: populateLabCategories, onFailure: displayMessage, onCompletion: () => setIsFetchingLabTests(false) })
        getImageTestCategories({ onSuccess: populateImageCategories, onFailure: displayMessage, onCompletion: () => setIsFetchingImageTests(false) })
    }, [])

    const getConsultationData = () => {
        getAppointmentPostConsultationData({ appointment_id: appointment_id, onSuccess: populateConsulationData, onFailure: displayMessage, onCompletion: () => setFetchingConsultData(false) })
    }

    const populateConsulationData = (data: any) => {
        setIsAppointmentDraft(data.is_draft)
        if (data && data.medical_history) {
            setHistoryInfo(data.medical_history)
        }
        if (data && data.lab_tests) {
            setRecordedLabTests(data.lab_tests)
        }
        if (data && data.image_tests) {
            setRecordedImageTests(data.image_tests)
        }
        if (data && data.other_tests) {
            if (data.other_tests.tests) {
                setRecordedOtherTests(data.other_tests.tests)
            }
            if (data.other_tests.findings) {
                setOtherTestFindings(data.other_tests.findings)
            }
        }
        if (data && data.diagnosisIcdCodes) {
            setSelectedIcdCodes(data.diagnosisIcdCodes)
        }
        if (data && data.prescriptions) {
            setRecordedDrugs(data.prescriptions)
        }

        if (data && data.diagnosis_comments && data.diagnosis_comments.comments) {
            setDiagnosisComments(data.diagnosis_comments.comments)
        }
        if (data && data.treatment_plan && data.treatment_plan.treatment_plan) {
            setTreatmentPlan(data.treatment_plan.treatment_plan)
        }
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
                oldArray.push(element)
            }
        })
        oldArray.forEach((element, index) => {
            if (!newArray.includes(element)) {
                oldArray.splice(index, 1)
            }
        })
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
        // const payload = {
        //     appointmentId: appointment_id,
        //     isDraft: isDraft,
        //     historyData: historyInfo,
        //     labTestData: labTestData,
        //     diagnosisData: diagnosisData,
        //     treatmentData: treatmentData,
        //     labTestDocuments: uploadedFiles
        // }
        const payload = new FormData()

        // payload.append('_method', 'put')
        payload.append('appointmentId', appointment_id)
        payload.append('isDraft', isDraft.toString())
        payload.append('historyData', JSON.stringify(historyInfo))
        payload.append('labTestData', JSON.stringify(labTestData))
        payload.append('diagnosisData', JSON.stringify(diagnosisData))
        payload.append('treatmentData', JSON.stringify(treatmentData))
        setIsLoading(true)

        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach((file, index) => {
                payload.append(`labTestDocuments[${index}]`, {
                    uri: file.uri,
                    type: file.type,
                    name: `file_${index}.${file.type.split('/')[1]}`,
                })
            })
        }
        completeConsultation({ appointment_id: appointment_id, payload: payload, onSuccess: onSuccessPosting, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }

    const onSuccessPosting = (message: string) => {
        displayMessage(message)
        setFetchingConsultData(true)
        getConsultationData()
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
        )
    }

    const removeFile = (uri: string) => {
        setUploadedFiles(prevFiles =>
            prevFiles.filter(file => file.uri !== uri)
        )
    }

    const confirmRemoveImage = (uri: string) => {
        Alert.alert(
            `Confirm`,
            `Are you sure you want to remove this file?`,
            [
                { text: 'No', onPress: () => { } },
                {
                    text: 'Yes', onPress: () => {
                        removeFile(uri)
                    }
                },
            ],
            { cancelable: false }
        )
    }

    const renderFileItem = ({ item }: { item: UploadedFile }) => {
        if (item.isImage) {
            return (
                <TouchableOpacity style={styles.fileView} onPress={() => confirmRemoveImage(item.uri)}>
                    <Image source={{ uri: item.uri }} style={{ width: '100%', height: 150 }} />
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={styles.fileView} onPress={() => confirmRemoveImage(item.uri)}>
                    <PDFView style={styles.image} source={{ uri: item.uri }} />
                </TouchableOpacity>
            )
        }
    }

    const handleLabTestFilesUpload = async () => {
        try {
            const results = await DocumentPicker.pick({
                allowMultiSelection: true,
                type: [types.images, types.pdf]
            })
            const files: UploadedFile[] = []
            for (const result of results) {
                const fileUri = result.uri
                const fileType = result.type
                const fileContent = await RNFS.readFile(fileUri, 'base64')
                const isImage: any = fileType && fileType.startsWith('image/')

                files.push({
                    uri: fileUri,
                    type: fileType!,
                    content: fileContent,
                    isImage: isImage,
                })
            }
            setUploadedFiles(prevFiles => [...prevFiles, ...files])
        } catch (err: unknown) {
            handleError(err)
        }
    }

    const handleError = (err: unknown) => {
        if (isCancel(err)) {
        } else if (isInProgress(err)) {
            console.log('multiple pickers were opened, only the last will be considered')
        } else {
            throw err
        }
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
            { id: 3, text: 'Add other tests', action: toggleOtherTestModal },
            { id: 4, text: 'Upload labtest files if any', action: handleLabTestFilesUpload }
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
                    style={{ marginBottom: 20, flex: 1, }}
                    contentContainerStyle={{ flexGrow: 1, top: 10 }}
                    horizontal={false} nestedScrollEnabled={true}>
                    {uploadedFiles && uploadedFiles.length > 0 && (
                        <>
                            <Text style={{ color: config.colors.green_1, marginLeft: 20 }}>{uploadedFiles.length} uploaded file{uploadedFiles.length > 1 ? 's' : ''}</Text>
                            <FlatList
                                data={uploadedFiles}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={renderFileItem}
                                scrollEnabled={false} />
                        </>
                    )}
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
                    isAppointmentDraft={isAppointmentDraft}
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
                    isAppointmentDraft={isAppointmentDraft}
                    onSubmit={() => handleAddTest(selectedImageTestItem, imageTestFindings, recordedImageTests, setRecordedImageTests, () => setImageTestFindings(''))} />

                <OtherTestsModal
                    modalTitle={"Enter other tests information"}
                    isVisible={isotherTestModalVisible}
                    toggleModal={toggleOtherTestModal}
                    otherTests={recordedOtherTests}
                    setOtherTests={setRecordedOtherTests}
                    otherTestFindings={otherTestFindings}
                    isAppointmentDraft={isAppointmentDraft}
                    setOtherTestFindings={setOtherTestFindings} />
            </SafeAreaView>
        )
    }

    const CustomRenderScene = ({ route }: { route: any }) => {
        switch (route.key) {
            case 'history':
                return <HistoryTabScreen historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} isAppointmentDraft={isAppointmentDraft} />
            case 'lab':
                return <LabTabScreen />
            case 'diagnosis':
                return <DiagnosisTabScreen icd10Codes={icd10Codes} onSelect={onSelectICDCode} comments={diagnosisComments} setComments={setDiagnosisComments} isAppointmentDraft={isAppointmentDraft} />
            case 'treatment':
                return <TreatmentTabScreen recordedDrugs={recordedDrugs} setRecordedDrugs={setRecordedDrugs} allergies={historyInfo.drug_allergies} treatmentPlan={treatmentPlan} setTreatmentPlan={setTreatmentPlan} isAppointmentDraft={isAppointmentDraft} />
            default:
                return null
        }
    }

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
                {isAppointmentDraft ?
                    <>
                        <TouchableOpacity style={[config.styles.secondaryBtn, { width: '100%', marginBottom: 5 }]}
                            onPress={() => submit(true)}>
                            <Text style={[config.styles.btnText, { color: config.colors.primary }]}>Save as Draft</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[config.styles.primaryBtn, { width: '100%', marginBottom: 10 }]}
                            onPress={() => submit(false)}>
                            <Text style={[config.styles.btnText, { color: config.colors.white }]}>Submit</Text>
                        </TouchableOpacity>
                    </>
                    : null
                }
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
    },

    fileView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 18,
        marginHorizontal: 16,
        backgroundColor: config.colors.white,
    },

    image: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
})