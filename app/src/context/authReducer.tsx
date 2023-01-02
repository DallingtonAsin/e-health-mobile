import * as types from './actions';

const authReducer = (state: any, action: any) => {
    console.log(`Current action data`, action.payload);
    switch (action.type) {
        case types.USER_SIGNIN:
            return {
                user: null,
                authorization: action.payload.access_token,
                token: null
            };
        case types.USER_VERIFY:
            return {
                user: null,
                authorization: action.payload.access_token,
                token: null
            };
        case types.USER_SIGNUP:
            return {
                user: null,
                authorization: action.payload.access_token,
                token: null
            };
        case types.HOME:
            return {
                user: action.payload,
                authorization: action.payload.access_token,
                token: action.payload.access_token,
                isAppLoading: false
            };
        case types.USER_SIGNOUT:
            return {
                user: null,
                authorization: null,
                token: null
            };
        case types.HYDRATE:
            return action.payload;
        case types.STOP_SPINNER:
                return {
                    ...state,
                    isAppLoading: false
                };
        default:
            return state;
    }
};

export { authReducer }