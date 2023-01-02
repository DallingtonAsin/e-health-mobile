import createDataContext from './createDataContext';
import { routes } from '../network/routes';
import Service from '../network/services/httpService';
import { IUser, LoginData } from '../interfaces';
import { storeUser, storeAuthToken, storeAccessToken, removeAuthToken, removeAccessToken } from '../network/services/asyncStorageService';
import { authReducer } from './authReducer';
import { initialUserState } from '../configs/constants';
import { displayErrorMessage } from '../components/common/SharedHelper';
import * as types from './actions'

const services = new Service();

const signin = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: LoginData, onSuccess: any, onFailure: any, onCompletion: any }) => {

        services.post(
            routes.user.signin,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                await storeAuthToken(data.access_token);

                dispatch({
                    type: types.USER_SIGNIN,
                    payload: data
                });

                onSuccess(data.otp);
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
            routes.user.verify,
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
                        types: types.HOME,
                        payload: data,
                        isAppLoading: false
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
            routes.user.register,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                await storeAccessToken(data.access_token);
                await storeUser(data);

                dispatch({
                    types: types.HOME,
                    payload: data,
                    isAppLoading: false
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

const updateProfile = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => {

        services.post(
            routes.user.updateProfile,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                let user = data.user;

                await storeAccessToken(user.access_token);
                await storeUser(user);

                dispatch({
                    types: types.HOME,
                    payload: user,
                    isAppLoading: false
                });

                onSuccess(res.data.message);
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
        await removeAuthToken();
        await removeAccessToken();
        dispatch({
            type: types.USER_SIGNOUT,
            isAppLoading: false
        });
    };
};

export const { Provider, Context, } = createDataContext(
    authReducer,
    { signin, verifyCode, signup, updateProfile, signout },
    { user: initialUserState, token: '', authorization: '', isAppLoading: true },
);