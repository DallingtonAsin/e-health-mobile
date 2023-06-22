import createDataContext from './createDataContext'
import { routes } from '../network/routes'
import Service from '../network/services/httpService'
import { IUser, LoginData, LoginPayload, PatientRegistrationPayload } from '../interfaces'
import { storeUser, storeAuthToken, storeAccessToken, removeAuthToken, removeAccessToken, removeUser, getUser } from '../network/services/asyncStorageService'
import { appReducer } from './reducers/appReducer'
import { initialUserState } from '../configs/constants'
import { displayErrorMessage } from '../components/common/SharedHelper'
import * as types from './actions'
const services = new Service()

const signin = (dispatch: any) => {
    return ({ payload, is_patient, onSuccess, onFailure, onCompletion }: { payload: LoginPayload, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? routes.patient.signin : routes.doctor.signin
        services.post(
            endpoint,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data
                let access_token = data.access_token

                await storeAuthToken(access_token)
                await storeAccessToken(access_token)
                await storeUser(data)

                dispatch({
                    type: types.HOME,
                    payload: data
                })

                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const sendVerificationCode = (dispatch: any) => {
    return ({ payload, is_patient, onSuccess, onFailure, onCompletion }: { payload: LoginData, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? routes.patient.send_otp : routes.doctor.send_otp
        services.post(
            endpoint,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data
                await storeAuthToken(data.access_token)

                dispatch({
                    type: types.USER_SIGNIN,
                    payload: data
                })

                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}


const verifyCode = (dispatch: any) => {
    return ({ code, is_patient, onSuccess, onFailure, onCompletion }: { code: string, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? routes.patient.verify : routes.doctor.verify
        services.post(
            endpoint,
            { otp: code }
        ).then(async (res) => {

            if (res && res.data) {

                const data = res.data
                let access_token = data.access_token
                await storeAuthToken(access_token)

                if (data.profile_status == 1) {
                    await storeAccessToken(access_token)
                    await storeUser(data)
                    dispatch({
                        type: types.HOME,
                        payload: data
                    })
                } else {
                    dispatch({
                        type: types.USER_SIGNUP,
                        payload: data
                    })
                }

                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const signup = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: PatientRegistrationPayload, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.patient.register,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data

                await storeAccessToken(data.access_token)
                await storeUser(data)

                dispatch({
                    type: types.HOME,
                    payload: data
                })

                onSuccess()
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const authenticateDoctor = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: LoginData, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.doctor.signin,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data
                let access_token = data.access_token
                await storeAuthToken(access_token)

                if (data.profile_status == 1) {
                    await storeAccessToken(access_token)
                    await storeUser(data)
                    dispatch({
                        type: types.HOME,
                        payload: data
                    })
                } else {
                    dispatch({
                        type: types.USER_SIGNUP,
                        payload: data
                    })
                }

                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const registerDoctor = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.doctor.register,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data
                await storeAccessToken(data.access_token)
                await storeUser(data)

                dispatch({
                    type: types.HOME,
                    payload: data
                })

                onSuccess()
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const signout = (dispatch: any) => {
    return async () => {
        await removeUser()
        await removeAuthToken()
        await removeAccessToken()
        dispatch({
            type: types.USER_SIGNOUT,
            payload: { isAppLoading: false }
        })
    }
}

const updateUserState = (dispatch: any) => {
    return async ({ onSuccess }: { onSuccess: any }) => {
        const user = await getUser()
        if (user && user.access_token) {
            dispatch({
                type: types.HYDRATE,
                payload: user
            })

            onSuccess()
        }
    }
}


export const { Provider, Context } = createDataContext(
    appReducer,
    { signin, sendVerificationCode, verifyCode, signup, authenticateDoctor, registerDoctor, updateUserState, signout },
    { user: initialUserState, token: null, authorization: null, isAppLoading: true },
)