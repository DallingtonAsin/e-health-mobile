import createDataContext from './createDataContext';
import { routes } from '../network/routes';
import Service from '../network/services/httpService';
import { IUser, AppointmentInfo, LoginData } from '../interfaces';
import { storeUser, storeAuthToken, storeAccessToken } from '../network/services/asyncStorageService';
import { appReducer } from './reducers/appReducer';
import { initialUserState } from '../configs/constants';
import { displayErrorMessage } from '../components/common/SharedHelper';
import * as types from './actions';

const services = new Service();

const signin = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: LoginData, onSuccess: any, onFailure: any, onCompletion: any }) => {

        services.post(
            routes.patient.signin,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                await storeAuthToken(data.access_token);

                dispatch({
                    type: types.USER_SIGNIN,
                    payload: data
                });

                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};


const verifyCode = (dispatch: any) => {
    return ({ code, onSuccess, onFailure, onCompletion }: { code: string, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.patient.verify,
            { otp: code }
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

const signup = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.patient.register,
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

const submitAppointment = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: AppointmentInfo, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.appointments.index,
            payload
        ).then(async (res: any) => {
            if (res && res.data) {
                onSuccess(res.data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const cancelAppointment = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.put(
            routes.appointments.cancel,
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

const getMedicalHistory = () => {
    return ({ patient_id, onSuccess, onFailure, onCompletion }: { patient_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.medical.history}/${patient_id}`
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

export const { Provider, Context } = createDataContext(
    appReducer,
    {
        signin, verifyCode, signup, submitAppointment, cancelAppointment, getMedicalHistory
    },
    { user: initialUserState, token: '', authorization: '', isAppLoading: true },
);