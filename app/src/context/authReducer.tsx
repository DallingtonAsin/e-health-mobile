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

export { authReducer }