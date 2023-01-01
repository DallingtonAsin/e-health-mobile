import createDataContext from './createDataContext';
import { routes } from '../network/routes';
import Service from '../network/services/httpService';
import { IUser, LoginData } from '../interfaces';
import { storeAuthToken, storeAccessToken } from '../network/services/asyncStorageService';

const services = new Service();

const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'signin':
            return {
                ...action.payload,
                authorization: action.payload.access_token,
                token: null
            };
        case 'verify':
            return {
                ...action.payload,
                authorization: action.payload.access_token,
                token: null
            };
        case 'signup':
            return {
                ...action.payload,
                authorization: action.payload.access_token,
                token: null,
            };
        case 'home':
            return {
                ...action.payload,
                authorization: action.payload.access_token,
                token: action.payload.access_token,
            };
        case 'signout':
            return { authorization: null, token: null };
        default:
            return state;
    }
};

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
                    type: 'signin',
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
                    dispatch({
                        type: 'home',
                        payload: data
                    });
                } else {
                    dispatch({
                        type: 'signup',
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

                dispatch({
                    type: 'home',
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
    return () => {
        dispatch({ type: 'signout' });
    };
};

const displayErrorMessage = (error: any, onFailure: any) => {
    let message;
    if (error && error.response) {
        message = error.response.data.message;
    } else if(error.message){
        message = String(error.message);
    }else{
       message = String(error);
    }

    onFailure(message);
}

export const { Provider, Context } = createDataContext(
    authReducer,
    { signin, verifyCode, signup, signout },
    { token: null, email: '' },
);