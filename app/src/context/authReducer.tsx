const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'signin':
            return {
                user: null,
                authorization: action.payload.access_token,
                token: null
            };
        case 'verify':
            return {
                user: null,
                authorization: action.payload.access_token,
                token: null
            };
        case 'signup':
            return {
                user: null,
                authorization: action.payload.access_token,
                token: null
            };
        case 'home':
            return {
                user: action.payload,
                authorization: action.payload.access_token,
                token: action.payload.access_token,
                isAppLoading:  false
            };
        case 'signout':
            return { user: null, authorization: null, token: null };
        case "hydrate":
            return action.payload
        default:
            return state;
    }
};

export { authReducer }