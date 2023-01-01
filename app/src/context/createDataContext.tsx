import React, { useReducer } from 'react';
import { IUser, LoginData } from '../interfaces';

export default ( reducer: any , action: any, defaultValue: any ) => {

    const Context = React.createContext({
        state: {token: null, otp: null, profile_status: 0},
        signin: ({payload, onSuccess, onFailure, onCompletion}: {payload: LoginData, onSuccess: any, onFailure:any, onCompletion:any}) => {},
        verifyCode: (code: string) => {},
        signup: (payload: IUser) => {},
    });

    const Provider = ({ children }: {children: any}) => {
        const [ state, dispatch ] = useReducer(reducer, defaultValue);

        const boundActions:any = {};

        for (let key in action){
            boundActions[key] = action[key](dispatch);
        }

        return(
            <Context.Provider value={{ state, ...boundActions }}>
                { children }
            </Context.Provider>
        )
    };

    return { Context: Context, Provider: Provider };
};