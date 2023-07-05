import createDataContext from './createDataContext'
import { routes } from '../network/routes'
import Service from '../network/services/httpService'
import { storeUser, storeAccessToken } from '../network/services/asyncStorageService'
import { appReducer } from './reducers/appReducer'
import { displayErrorMessage } from '../components/common/SharedHelper'
import * as types from './actions'

const services = new Service()

const updateProfile = (dispatch: any) => {
    return ({ payload, is_patient, onSuccess, onFailure, onCompletion }: { payload: FormData, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? routes.patient.updateProfile : routes.doctor.updateProfile
        services.post(
            endpoint,
            payload,
            true
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data
                const user = data.user
                const message = res.data.message

                await storeAccessToken(user.access_token)
                await storeUser(user)

                dispatch({
                    type: types.HOME,
                    payload: user
                })

                onSuccess(message)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const updateProfileImage = (dispatch: any) => {
    return ({ payload, is_patient, onSuccess, onFailure, onCompletion }: { payload: FormData, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? routes.patient.update_profile_pic : routes.doctor.update_profile_pic
        services.post(
            endpoint,
            payload,
            true
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data
                const user = data.user
                const message = data.message

                await storeAccessToken(user.access_token)
                await storeUser(user)

                dispatch({
                    type: types.HOME,
                    payload: user
                })

                onSuccess(message)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const deleteProfileImage = (dispatch: any) => {
    return ({ user, onSuccess, onFailure, onCompletion }: { user: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = user.is_patient ? routes.patient.delete_profile_pic : routes.doctor.delete_profile_pic

        services.delete(
            endpoint
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data
                const user = data.user
                const message = data.message

                await storeAccessToken(user.access_token)
                await storeUser(user)

                dispatch({
                    type: types.HOME,
                    payload: user
                })

                onSuccess(message)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}


const getMedicalSpecialties = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.medical.specialties
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const getDoctorsBySpecialty = () => {
    return ({ specialtyId, onSuccess, onFailure, onCompletion }: { specialtyId: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.medical.doctors_by_specialty}/${specialtyId}`
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const getAppointmentTypes = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.appointments.types
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const getMeetingDetails = () => {
    return ({ appointmentId, onSuccess, onFailure, onCompletion }: { appointmentId: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.appointments.meeting}/${appointmentId}`
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}


const getMyAppointments = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = payload.is_patient ? routes.appointments.patient.myappointments : routes.appointments.doctor.myappointments
        services.get(
            `${endpoint}/${payload.user_id}/${payload.path}`
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}


const getDrugs = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.drugs.index
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const getPrescriptionDrugs = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.drugs.prescription
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}


const getNotifications = () => {
    return ({ is_patient, onSuccess, onFailure, onCompletion }: { is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? routes.patient.notifications.all : routes.doctor.notifications.all
        services.get(
            endpoint
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const markNotificationRead = () => {
    return ({ notification_id, is_patient, onSuccess, onFailure, onCompletion }: { notification_id: string, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? `${routes.patient.notifications.mark_as_read}/${notification_id}` : `${routes.doctor.notifications.mark_as_read}/${notification_id}`
        services.post(
            endpoint,
            {}
        ).then(async (res) => {
            if (res && res.data) {
                onSuccess(res.data.message)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const getDoctorLanguages = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.doctor.languages}`
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const getAppointmentDetails = () => {
    return ({ appointment_id, onSuccess, onFailure, onCompletion }: { appointment_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = `${routes.medical.appointment_details}/${appointment_id}`
        services.get(
            endpoint
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const checkAppointmentStatus = () => {
    return ({ appointment_id, onSuccess, onFailure, onCompletion }: { appointment_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.medical.appointment_status}/${appointment_id}/status`
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const postCallDetails = () => {
    return ({ is_patient, payload, onSuccess, onFailure, onCompletion }: { is_patient: boolean, payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? `${routes.patient.call_details}` : `${routes.doctor.call_details}`
        services.post(
            endpoint,
            payload
        ).then(async (res) => {
            if (res && res.data) {
                onSuccess(res.data.message)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const getCompanyInformation = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.app.company_info}`
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const getHeldAppointments = () => {
    return ({ is_patient, onSuccess, onFailure, onCompletion }: { is_patient: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? routes.medical.history.patient.held_calls : routes.medical.history.doctor.held_calls
        services.get(
            endpoint
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data
                onSuccess(data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}


export const { Provider, Context } = createDataContext(
    appReducer,
    {
        updateProfile, getMedicalSpecialties, getDoctorsBySpecialty, getDrugs, getPrescriptionDrugs, getMeetingDetails,
        getAppointmentTypes, getMyAppointments, deleteProfileImage, updateProfileImage, checkAppointmentStatus, getHeldAppointments,
        getDoctorLanguages, getNotifications, markNotificationRead, getAppointmentDetails, postCallDetails, getCompanyInformation
    },
    { isAppLoading: true },
)