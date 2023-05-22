import React from "react";
import { AppointmentInfo, IUser, LoginData, LoginPayload, PatientRegistrationPayload } from '../interfaces';

const createContext = (defaultValue: any) => {

    const Context = React.createContext({
        state: defaultValue,

        // patient api methods
        signin: ({ payload, is_patient, onSuccess, onFailure, onCompletion }: { payload: LoginPayload, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        sendVerificationCode: ({ payload, is_patient, onSuccess, onFailure, onCompletion }: { payload: LoginData, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        verifyCode: ({ code, is_patient, onSuccess, onFailure, onCompletion }: { code: string, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        signup: ({ payload, onSuccess, onFailure, onCompletion }: { payload: PatientRegistrationPayload, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        signout: () => { },
        markDoctorFavourite: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        unMarkDoctorFavourite: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        postRating: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        
        // general api methods
        updateProfile: ({ payload, is_patient, onSuccess, onFailure, onCompletion }: { payload: FormData, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        updateProfileImage: ({ payload, is_patient, onSuccess, onFailure, onCompletion }: { payload: FormData, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        deleteProfileImage: ({ user, onSuccess, onFailure, onCompletion }: { user: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMedicalSpecialties: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDrugs: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorsBySpecialty: ({ specialtyId, onSuccess, onFailure, onCompletion }: { specialtyId: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorInfo: ({ doctorId, onSuccess, onFailure, onCompletion }: { doctorId: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getAppointmentTypes: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMeetingDetails: ({ appointmentId, onSuccess, onFailure, onCompletion }: { appointmentId: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        submitAppointment: ({ payload, onSuccess, onFailure, onCompletion }: { payload: AppointmentInfo, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        completeAppointment: ({ appointment_id, payload, onSuccess, onFailure, onCompletion }: { appointment_id: number, payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        confirmAppointment: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        cancelAppointment: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMyAppointments: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorLanguages: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMedicalDoctors: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMedicalFacilities: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        updateUserState: ({ onSuccess }: { onSuccess: any }) => { },
        updateOnlineStatus: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },

        // doctor api methods
        authenticateDoctor: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        registerDoctor: ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        completeRegistration: ({ payload, onSuccess, onFailure, onCompletion }: { payload: FormData, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorsCalendar: ({ doctor_id, onSuccess, onFailure, onCompletion }: { doctor_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        submitDoctorSchedule: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getNotifications: ({ is_patient, onSuccess, onFailure, onCompletion }: { is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        markNotificationRead: ({ notification_id, is_patient, onSuccess, onFailure, onCompletion }: { notification_id: string, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMedicalHistory: ({ patient_id, onSuccess, onFailure, onCompletion }: { patient_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        isVerified: ({ screen, onSuccess, onFailure, onCompletion }: { screen: string, onSuccess: any, onFailure: any, onCompletion: any }) => { },
    });

    return Context;
}

export { createContext }