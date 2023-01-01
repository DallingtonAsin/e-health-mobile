const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'signin':
            return {
                user: null,
                authorization: action.payload.access_token,
                token: null,
                isLoading: true
            };
        case 'verify':
            return {
                user: null,
                authorization: action.payload.access_token,
                token: null,
                isLoading: true
            };
        case 'signup':
            return {
                user: null,
                authorization: action.payload.access_token,
                token: null,
                isLoading: true
            };
        case 'home':
            return {
                user: action.payload,
                authorization: action.payload.access_token,
                token: action.payload.access_token,
                isLoading: true
            };
        case 'signout':
            return { user: null, authorization: null, token: null, isLoading: false };
        case "hydrate":
            return action.payload
        default:
            return state;
    }
};

export { authReducer }