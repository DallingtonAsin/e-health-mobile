import React from 'react'
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native'
import * as config from '../../configs'
import { TextInput } from 'react-native-paper'
import { IMedicalHistData } from '../../interfaces'

const HistoryTabScreen = ({
    historyInfo,
    setHistoryInfo
}: {
    historyInfo: IMedicalHistData,
    setHistoryInfo: React.Dispatch<React.SetStateAction<IMedicalHistData>>,
}) => (
    <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 10 }]}>
        <ScrollView
            style={{ marginTop: 0 }}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Presenting complaint<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                <TextInput
                    editable
                    multiline={true}
                    numberOfLines={3}
                    label="Presenting complaint"
                    value={historyInfo.presenting_complaint}
                    mode="outlined"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    disabled={false}
                    onChangeText={(text: string) => setHistoryInfo((prev: IMedicalHistData) => ({ ...prev, presenting_complaint: text }))}
                />
            </View>

            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Past medical history<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                <TextInput
                    editable
                    multiline={true}
                    numberOfLines={3}
                    value={historyInfo.past_medical_history}
                    mode="outlined"
                    label="Past medical history"
                    placeholder="Past medical history can include patient current treatment"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    disabled={false}
                    onChangeText={(text: string) => setHistoryInfo((prev: IMedicalHistData) => ({ ...prev, past_medical_history: text }))}
                />
            </View>
            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Drug allergies<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                <TextInput
                    editable
                    multiline={true}
                    numberOfLines={3}
                    label="Drug allergies..."
                    value={historyInfo.drug_allergies}
                    mode="outlined"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    textColor={config.colors.dark}
                    onChangeText={(text: string) => setHistoryInfo((prev: IMedicalHistData) => ({ ...prev, drug_allergies: text }))}
                />
            </View>

            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Findings
                    <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                <TextInput
                    editable
                    multiline={true}
                    numberOfLines={3}
                    label="Findings..."
                    value={historyInfo.findings}
                    mode="outlined"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    textColor={config.colors.dark}
                    onChangeText={(text: string) => setHistoryInfo((prev: IMedicalHistData) => ({ ...prev, findings: text }))}
                />
            </View>


            <View style={styles.viewContainer}>
                <Text style={styles.infoText}>*For any mandatory field, enter "None or N/A" if not applicable.</Text>
            </View>

        </ScrollView>
    </SafeAreaView>
)

export default HistoryTabScreen

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: config.colors.white
    },
    viewContainer: {
        marginVertical: 5,
        paddingHorizontal: 10
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
    labelTxt: {
        fontSize: config.fonts.normal,
        color: config.colors.black
    }
})