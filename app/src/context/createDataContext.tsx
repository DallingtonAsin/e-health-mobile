import React, { useReducer, useEffect } from 'react';
import { AppointmentInfo, IUser, LoginData } from '../interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as types from './actions'

export default (reducer: any, action: any, defaultValue: any) => {

    const storeData = async (value: any) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('access_token', jsonValue)
        } catch (e) {
            throw e;
        }
    }

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('access_token')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            throw e;
        }
    }

    const Context = React.createContext({
        state: defaultValue,
        authenticateDoctor: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        signin: ({ payload, onSuccess, onFailure, onCompletion }: { payload: LoginData, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        verifyCode: ({ code, onSuccess, onFailure, onCompletion }: { code: string, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        signup: ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        signout: () => { },
        updateProfile: ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMedicalSpecialties: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorsBySpecialty: ({ specialtyId, onSuccess, onFailure, onCompletion }: { specialtyId: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorInfo: ({ doctorId, onSuccess, onFailure, onCompletion }: { doctorId: number, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getAppointmentTypes: ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => { },
        submitAppointment: ({ payload, onSuccess, onFailure, onCompletion }: { payload: AppointmentInfo, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        cancelAppointment: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getMyAppointments: ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorLanguages: ({ onSuccess, onFailure, onCompletion }: {  onSuccess: any, onFailure: any, onCompletion: any }) => { },
        getDoctorSpecialties: ({ onSuccess, onFailure, onCompletion }: {  onSuccess: any, onFailure: any, onCompletion: any }) => { },
        registerDoctor: ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => { },
    });

    const Provider = ({ children }: { children: any }) => {

        const [state, dispatch] = useReducer(reducer, defaultValue);

        useEffect(() => {
            async function rehydrate() {
                const storedState = await getData();

                if (storedState) {
                    // console.log(`Stored state is available`);
                    dispatch({
                        type: types.HYDRATE,
                        payload: storedState
                    });
                }

                dispatch({
                    type: types.STOP_SPINNER,
                    payload: { isAppLoading: false }
                });
            }
            rehydrate()
        }, []);

        useEffect(() => {
            storeData(state);
        }, [state])

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