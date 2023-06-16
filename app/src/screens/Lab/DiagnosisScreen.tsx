import React from 'react'
import { SafeAreaView, View, Text, StyleSheet } from 'react-native'
import * as config from '../../configs'
import { TextInput } from 'react-native-paper'
import { MultiSearchableDropdown } from '../../components/CustomSearchableDropdown'

const DiagnosisScreen = ({
    icd10Codes,
    selectedIcdCodes,
    onSelectICDCode,
    onRemoveICDCode,
    comments,
    setComments
}: {
    icd10Codes: any,
    selectedIcdCodes: any,
    onSelectICDCode: (item: any) => void,
    onRemoveICDCode: (item: any) => void,
    comments: string,
    setComments: React.Dispatch<React.SetStateAction<string>>,
}) => (
    <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 10, backgroundColor: config.colors.white }]}>
        <View style={{ paddingHorizontal: 10, marginVertical: 5 }}>
            <Text style={styles.labelTxt}>Select ICD-10 Code</Text>
            <MultiSearchableDropdown
                items={icd10Codes}
                selectedItems={selectedIcdCodes}
                placeholderStr="Select ICD10 Code"
                textInputStr="ICD10 Code"
                onItemSelect={onSelectICDCode}
                onRemoveItem={onRemoveICDCode}
            />
        </View>

        <View style={styles.viewContainer}>
            <Text style={styles.labelTxt}>Additional comments<Text style={config.styles.registration.doctor.required}>*</Text></Text>
            <TextInput
                multiline
                numberOfLines={5}
                label="Additional comments"
                value={comments}
                mode="outlined"
                activeOutlineColor={config.colors.primary}
                style={styles.textInput}
                textColor={config.colors.dark}
                onChangeText={(text: string) => setComments(text)} />
        </View>

        <View style={[config.styles.bottomFooter, { paddingHorizontal: 5, left: 15 }]}>
            <Text style={styles.infoText}>*For any mandatory field, if it is not applicable, please enter "None or N/A".</Text>
        </View>
    </SafeAreaView>
)

export default DiagnosisScreen

const styles = StyleSheet.create({

    viewContainer: {
        marginVertical: 5,
        paddingHorizontal: 10,
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

    infoText: {
        color: config.colors.red,
        textAlign: 'center'
    }
})
