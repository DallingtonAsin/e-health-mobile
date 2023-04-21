import createDataContext from './createDataContext';
import { routes } from '../network/routes';
import Service from '../network/services/httpService';
import { IUser, LoginData } from '../interfaces';
import { storeUser, storeAuthToken, storeAccessToken } from '../network/services/asyncStorageService';
import { appReducer } from './reducers/appReducer';
import { initialUserState } from '../configs/constants';
import { displayErrorMessage } from '../components/common/SharedHelper';
import * as types from './actions';

const services = new Service();


const authenticateDoctor = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: LoginData, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.doctor.signin,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                let access_token = data.access_token;
                await storeAuthToken(access_token);

                if (data.profile_status == 1) {
                    await storeAccessToken(access_token);
                    await storeUser(data);
                    dispatch({
                        type: types.HOME,
                        payload: data
                    });
                } else {
                    dispatch({
                        type: types.USER_SIGNUP,
                        payload: data
                    });
                }

                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const registerDoctor = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.doctor.register,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                await storeAccessToken(data.access_token);
                await storeUser(data);

                dispatch({
                    type: types.HOME,
                    payload: data
                });

                onSuccess();
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const getDoctorInfo = () => {
    return ({ doctorId, onSuccess, onFailure, onCompletion }: { doctorId: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.medical.doctors}/${doctorId}`
        ).then(async (res) => {
            if (res && res.data) {
                let data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const getDoctorsCalendar = () => {
    return ({ doctor_id, onSuccess, onFailure, onCompletion }: { doctor_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.doctor.calendar}/${doctor_id}`
        ).then(async (res) => {
            if (res && res.data) {
                let data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};


const completeAppointment = () => {
    return ({ appointment_id, payload, onSuccess, onFailure, onCompletion }: { appointment_id: number, payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.put(
            `${routes.appointments.index}/${appointment_id}/complete`,
            payload
        ).then(async (res: any) => {
            if (res && res.data && res.data.message) {
                let message = res.data.message;
                onSuccess(message);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const submitDoctorSchedule = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.doctor.calendar,
            payload
        ).then(async (res) => {
            if (res && res.data) {
                onSuccess(res.data.message);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};





export const { Provider, Context } = createDataContext(
    appReducer,
    { authenticateDoctor, registerDoctor, getDoctorInfo, getDoctorsCalendar, submitDoctorSchedule, completeAppointment },
    { isAppLoading: true },
);