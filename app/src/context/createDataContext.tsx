import React, { useReducer } from 'react';
import { IUser, LoginData } from '../interfaces';
import { initialLoginState } from '../configs/constants';

export default ( reducer: any , action: any, defaultValue: any ) => {

    const Context = React.createContext({
        state: initialLoginState,
        signin: ({payload, onSuccess, onFailure, onCompletion}: {payload: LoginData, onSuccess: any, onFailure:any, onCompletion:any}) => {},
        verifyCode: ({code, onSuccess, onFailure, onCompletion}: {code: string , onSuccess: any, onFailure:any, onCompletion:any}) => {},
        signup: ({payload, onSuccess, onFailure, onCompletion}: {payload: IUser, onSuccess: any, onFailure:any, onCompletion:any}) => {},
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