import React, { useReducer, useEffect, useState } from 'react';
import { IUser, LoginData } from '../interfaces';
import { getAccessToken } from '../network/services/asyncStorageService';
// import { initialLoginState } from '../configs/constants';

export default (reducer: any, action: any, defaultValue: any) => {

    const Context = React.createContext({
        state: defaultValue,
        signin: ({ payload, onSuccess, onFailure, onCompletion }: { payload: LoginData, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        verifyCode: ({ code, onSuccess, onFailure, onCompletion }: { code: string, onSuccess: any, onFailure: any, onCompletion: any }) => { },
        signup: ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => { },
    });

    const Provider = ({ children }: { children: any }) => {

        const [state, dispatch] = useReducer(reducer, defaultValue);
        console.log(`Default State is`, defaultValue);

        const boundActions: any = {};

        for (let key in action) {
            boundActions[key] = action[key](dispatch);
        }
        

        return (
            <Context.Provider value={{ state, ...boundActions }}>
                {children}
            </Context.Provider>
        )
    };

    return { Context: Context, Provider: Provider };
};