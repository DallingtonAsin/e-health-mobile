import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { TreatmentPlanModal, handleAddDrug } from "../../components/common/lab/TreatmentPlanModal"
import { IPrescriptionDrug, Option } from "../../interfaces"
import { renderDrugTable } from '../../components/common/lab/dataTable'
import { initialOption, initialPresDrugState } from '../../configs/constants'
import * as config from '../../configs'
import { TextInput } from 'react-native-paper'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import DropDownPicker from 'react-native-dropdown-picker'

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
    const [selectedDrugItem, setSelectedDrugItem] = useState<Option>(initialOption)
    const [selectedAdminRouteItem, setSelectedAdminRouteItem] = useState<Option>(initialOption)

    const [isDrugModalVisible, setIsDrugModalVisible] = useState(false)
    const [drugInfo, setDrugInfo] = useState<IPrescriptionDrug>(initialPresDrugState)

    const toggleDrugModal = () => setIsDrugModalVisible(!isDrugModalVisible)

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ]);

    const handleDrugItemSelect = (item: any) => {
        setSelectedDrugItem(item)
        const updatedDrugInfo: IPrescriptionDrug = {
            ...drugInfo,
            id: parseInt(item.id.toString()),
            name: item.name
        };
        setDrugInfo(updatedDrugInfo)
    }

    const handleAdminRouteItemSelect = (item: any) => {
        setSelectedAdminRouteItem(item)
        const updatedDrugInfo: IPrescriptionDrug = {
            ...drugInfo,
            route_of_admin: item.name
        };
        setDrugInfo(updatedDrugInfo)
    }

    return (
        <View>
            <TouchableOpacity style={[styles.item, { marginVertical: 10 }]} onPress={toggleDrugModal}>
                <Text style={styles.itemTitle}>Add prescription drug</Text>
                <Icon5 name="angle-right" size={20} color={config.colors.primary} style={styles.arrow} />
            </TouchableOpacity>

            {renderDrugTable(recordedDrugs, 'Prescription drugs')}

            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setValue={setValue}
                setItems={setItems}
                setOpen={setOpen}
            />

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
            <TreatmentPlanModal
                selectedDrugItem={selectedDrugItem}
                isVisible={isDrugModalVisible}
                drugInfo={drugInfo}
                setDrugInfo={setDrugInfo}
                toggleModal={toggleDrugModal}
                handleDrugItemSelect={handleDrugItemSelect}
                selectedAdminRoute={selectedAdminRouteItem}
                handleAdminRouteSelect={handleAdminRouteItemSelect}
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

    arrow: {
        right: 0
    }
})