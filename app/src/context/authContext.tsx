import createDataContext from './createDataContext';
import { routes } from '../network/routes';
import Service from '../network/services/httpService';
import { IUser, LoginData } from '../interfaces';
import { storeUser, storeAuthToken, storeAccessToken, removeAuthToken, removeAccessToken, removeUser } from '../network/services/asyncStorageService';
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

const signout = (dispatch: any) => {
    return async () => {
        await removeUser()
        await removeAuthToken();
        await removeAccessToken();
        dispatch({
            type: types.USER_SIGNOUT,
            payload: { isAppLoading: false }
        });
    };
};


export const { Provider, Context } = createDataContext(
    appReducer,
    { signin, verifyCode, signup, authenticateDoctor, registerDoctor, signout },
    { user: initialUserState, token: null, authorization: null, isAppLoading: true },
);