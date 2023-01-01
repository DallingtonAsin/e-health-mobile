import createDataContext from './createDataContext';
import { routes } from '../network/routes';
import Service from '../network/services/httpService';
import { IUser, LoginData } from '../interfaces';
import { storeAccessToken } from '../network/services/asyncStorageService';

const services = new Service();

const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'signout':
            return { token: null };
        case 'signin':
            return {
                ...action.payload,
                authorization: action.payload.authorization,
                token: null,
                isLoading: false,
            };
        case 'verify':
            return {
                ...action.payload,
                authorization: action.payload.access_token,
                token: action.payload.access_token,
                isLoading: false,
            };
        case 'signup':
            return {
                ...action.payload,
                token: action.payload.access_token,
                isLoading: false,
            };
        default:
            return state;
    }
};

const signin = (dispatch: any) => {
    return ({payload, onSuccess, onFailure, onCompletion}:{payload:any, onSuccess:any,onFailure:any, onCompletion:any}) => {
        console.log(`Payload`, payload);
        services.post(
            routes.user.signin,
            payload
        ).then(async (res) => {
            // console.log('Response', res);

            if (res && res.data) {

                let data = res.data;
                await storeAccessToken(res.data.authorization);

                dispatch({
                    type: 'signin',
                    payload: data
                });

                onSuccess(data.otp);
            }
        }).catch((error) => {
            console.log('Error', error);
            onFailure();
        }).finally(() => {
            onCompletion();
        });
    };
};


const verifyCode = (dispatch: any) => {
    return (code: string) => {
        services.post(
            routes.user.verify,
            { otp: code }
        ).then(async (res) => {
            if (res && res.data) {
                let data = res.data;
                await storeAccessToken(res.data.access_token);
                dispatch({
                    type: 'signup',
                    payload: data
                });
            }
        }).catch((error) => {
            console.log(`Error`, error);
        }).finally(() => {

        });
    };
};

const signup = (dispatch: any) => {
    return (payload: IUser) => {
        services.post(
            routes.user.register,
            payload
        ).then(async (res) => {
            if (res && res.data) {
                let data = res.data;
                await storeAccessToken(res.data.access_token);
                if (data.profile_status == 1) {
                    dispatch({
                        type: 'signup',
                        payload: data
                    });
                    // navigation.navigate('Home');
                } else {
                    // navigation.navigate('Register');
                    dispatch({
                        type: 'signup',
                        payload: data
                    });
                }
            }
        }).catch((error) => {
            throw error;
        }).finally(() => {
            // setIsLoading(false);
        });
    };
};

const signout = (dispatch: any) => {
    return () => {
        dispatch({ type: 'signout' });
    };
};

export const { Provider, Context } = createDataContext(
    authReducer,
    { signin, verifyCode, signup, signout },
    { token: null, email: '' },
);