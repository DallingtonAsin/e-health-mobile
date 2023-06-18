import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { TreatmentPlanModal, handleAddDrug } from "../../components/common/lab/TreatmentPlanModal"
import { IPrescriptionDrug } from "../../interfaces"
import { renderDrugTable } from '../../components/common/lab/dataTable'
import { initialPresDrugState } from '../../configs/constants'
import * as config from '../../configs'
import { TextInput } from 'react-native-paper'
import Icon5 from 'react-native-vector-icons/FontAwesome5'

const TreatmentTabScreen = ({
    recordedDrugs,
    setRecordedDrugs,
    treatmentPlan,
    setTreatmentPlan
}: {
    recordedDrugs: any,
    setRecordedDrugs: React.Dispatch<React.SetStateAction<any>>,
    treatmentPlan: string,
    setTreatmentPlan: React.Dispatch<React.SetStateAction<string>>
}) => {

    const [selectedDrugItem, setSelectedDrugItem] = useState<string>('')
    const [isDrugModalVisible, setIsDrugModalVisible] = useState(false)
    const [drugInfo, setDrugInfo] = useState<IPrescriptionDrug>(initialPresDrugState)

    const toggleDrugModal = () => setIsDrugModalVisible(!isDrugModalVisible)

    return (
        <View>
            <TouchableOpacity style={[styles.item, { marginVertical: 10 }]} onPress={toggleDrugModal}>
                <Text style={styles.itemTitle}>Add prescription drug</Text>
                <Icon5 name="angle-right" size={20} color={config.colors.primary} style={styles.arrow} />
            </TouchableOpacity>

            {renderDrugTable(recordedDrugs, 'Prescription drugs')}

            <View style={[styles.viewContainer, { backgroundColor: config.colors.white, marginHorizontal: 15, padding: 20 }]}>
                <Text style={styles.labelTxt}>Treatment Plan/Management<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                <TextInput
                    multiline
                    numberOfLines={6}
                    label="Treatment management/plan"
                    value={treatmentPlan}
                    mode="outlined"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    textColor={config.colors.dark}
                    onChangeText={(text: string) => setTreatmentPlan(text)}
                />
            </View>

            <View style={styles.viewContainer}>
                <Text style={styles.infoText}>*For any mandatory field, enter "None or N/A" if not applicable.</Text>
            </View>

            <TreatmentPlanModal
                isVisible={isDrugModalVisible}
                drugInfo={drugInfo}
                setDrugInfo={setDrugInfo}
                toggleModal={toggleDrugModal}
                setSelectedDrugItem={setSelectedDrugItem}
                onSubmit={() => handleAddDrug(selectedDrugItem, drugInfo, recordedDrugs, setRecordedDrugs, () => setDrugInfo(initialPresDrugState))}
            />
        </View>
    )
}

export default TreatmentTabScreen

const styles = StyleSheet.create({
    viewContainer: {
        marginVertical: 5,
        paddingHorizontal: 10
    },
    labelTxt: {
        fontSize: config.fonts.normal,
        color: config.colors.black
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
    textInput: {
        backgroundColor: config.colors.white,
        color: config.colors.silver,
        fontSize: config.fonts.normal
    },
    infoText: {
        color: config.colors.red,
        textAlign: 'center'
    },
    arrow: {
        right: 0
    }
})