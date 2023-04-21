import React, { useReducer, useEffect } from 'react';
import { AppAction, AppointmentInfo, IUser, LoginData } from '../interfaces';
import * as types from './actions'
import { getUser} from '../network/services/asyncStorageService';

export default (reducer: any, action: any, defaultValue: any) => {

    const Context = React.createContext({
        state: defaultValue,
        authenticateDoctor: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        signin: ({ payload, onSuccess, onFailure, onCompletion }: { payload: LoginData, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        verifyCode: ({ code, onSuccess, onFailure, onCompletion }: { code: string, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        signup: ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        signout: () => { },
        updateProfile: ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        updateProfileImage: ({ user, payload, onSuccess, onFailure, onCompletion }: { user: any, payload: FormData, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        deleteProfileImage: ({ user, onSuccess, onFailure, onCompletion }: { user: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMedicalSpecialties: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDrugs: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorsBySpecialty: ({ specialtyId, onSuccess, onFailure, onCompletion }: { specialtyId: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorInfo: ({ doctorId, onSuccess, onFailure, onCompletion }: { doctorId: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getAppointmentTypes: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMeetingDetails: ({ appointmentId, onSuccess, onFailure, onCompletion }: { appointmentId: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        submitAppointment: ({ payload, onSuccess, onFailure, onCompletion }: { payload: AppointmentInfo, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        completeAppointment: ({ appointment_id, payload, onSuccess, onFailure, onCompletion }: { appointment_id: number, payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        cancelAppointment: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMyAppointments: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorLanguages: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorSpecialties: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        registerDoctor: ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorsCalendar: ({ doctor_id, onSuccess, onFailure, onCompletion }: { doctor_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        submitDoctorSchedule: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getNotifications: ({ is_patient, onSuccess, onFailure, onCompletion }: { is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        markNotificationRead: ({ notification_id, is_patient, onSuccess, onFailure, onCompletion }: { notification_id: string, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMedicalHistory: ({ patient_id, onSuccess, onFailure, onCompletion }: { patient_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
    });

    const Provider = ({ children }: { children: any }) => {

        const [state, dispatch] = useReducer<(state: any, actions: AppAction) => any>(reducer, defaultValue);

        useEffect(() => {
            async function rehydrate() {
                const user = await getUser();
                if (user && user.access_token) {
                    dispatch({
                        type: types.HYDRATE,
                        payload: user
                    });
                }

                dispatch({
                    type: types.STOP_SPINNER,
                    payload: { isAppLoading: false }
                });
            }
            rehydrate()
        }, []);

        const boundActions: any = {};

        for (let key in action) {
            boundActions[key] = action[key](dispatch);
        }

        return (
            <Context.Provider value={{ state, ...boundActions }}>
                {children}
            </Context.Provider>
        )
    };

    return { Context: Context, Provider: Provider };
};