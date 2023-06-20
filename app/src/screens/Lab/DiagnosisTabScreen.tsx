import React from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import * as config from '../../configs'
import { TextInput } from 'react-native-paper'
import { CustomMultipleSelectDropdown } from '../../components/customSelectDropdowns'

const DiagnosisTabScreen = ({
    icd10Codes,
    selectedIcd10Codes = [],
    onSelect,
    comments,
    setComments
}: {
    icd10Codes: any,
    selectedIcd10Codes: any,
    onSelect: any,
    comments: string,
    setComments: React.Dispatch<React.SetStateAction<string>>,
}) => {

    return (
        <ScrollView
            nestedScrollEnabled={true}
            style={{ marginTop: 0 }}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>

            <View style={{ paddingHorizontal: 10, marginVertical: 5 }}>
                <Text style={styles.labelTxt}>Select ICD-10 Code</Text>
                <CustomMultipleSelectDropdown
                    data={icd10Codes}
                    selected={selectedIcd10Codes}
                    onSelect={onSelect}
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

            <View style={styles.viewContainer}>
                <Text style={styles.infoText}>*For any mandatory field, if it is not applicable, please enter "None or N/A".</Text>
            </View>
        </ScrollView>
    )
}

export default DiagnosisTabScreen

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        backgroundColor: config.colors.white
    },

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
