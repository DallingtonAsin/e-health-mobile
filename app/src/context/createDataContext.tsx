import React, { useReducer, useEffect } from 'react'
import { AppAction } from '../interfaces'
import * as types from './actions'
import { getUser } from '../network/services/asyncStorageService'
import { createContext } from '.'

export default (reducer: any, action: any, defaultValue: any) => {

    const Context = createContext(defaultValue)

    const Provider = ({ children }: { children: any }) => {
        const [state, dispatch] = useReducer<(state: any, actions: AppAction) => any>(reducer, defaultValue)

        useEffect(() => {
            async function rehydrate() {
                const user = await getUser()
                if (user && user.access_token) {
                    dispatch({
                        type: types.HYDRATE,
                        payload: user
                    })
                }

                dispatch({
                    type: types.STOP_SPINNER,
                    payload: { isAppLoading: false }
                })
            }
            rehydrate()
        }, [])

        const boundActions: any = {}

        for (let key in action) {
            boundActions[key] = action[key](dispatch)
        }

        return (
            <Context.Provider value={{ state, ...boundActions }}>
                {children}
            </Context.Provider>
        )
    }
    return { Context: Context, Provider: Provider }
}