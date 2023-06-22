import createDataContext from './createDataContext'
import { routes } from '../network/routes'
import Service from '../network/services/httpService'
import { AppointmentInfo } from '../interfaces'
import { appReducer } from './reducers/appReducer'
import { displayErrorMessage } from '../components/common/SharedHelper'

const services = new Service()

const submitAppointment = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: AppointmentInfo, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.appointments.index,
            payload
        ).then(async (res: any) => {
            if (res && res.data) {
                onSuccess(res.data)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const cancelAppointment = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.put(
            routes.appointments.cancel,
            payload
        ).then(async (res: any) => {
            if (res && res.data && res.data.message) {
                let message = res.data.message
                onSuccess(message)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const getMedicalHistory = () => {
    return ({ patient_id, onSuccess, onFailure, onCompletion }: { patient_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.medical.history}/${patient_id}`
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

const markDoctorFavourite = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.patient.mark_doctor_favourite,
            payload
        ).then(async (res: any) => {
            if (res && res.data && res.data.message) {
                const message = res.data.message
                onSuccess(message)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const unMarkDoctorFavourite = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.delete(
            `${routes.patient.unmark_doctor_favourite}/${payload.doctor_id}`
        ).then(async (res: any) => {
            if (res && res.data && res.data.message) {
                const message = res.data.message
                onSuccess(message)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const postRating = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.patient.rate_doctor,
            payload
        ).then(async (res: any) => {
            if (res && res.data && res.data.message) {
                const message = res.data.message
                onSuccess(message)
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure)
        }).finally(() => {
            onCompletion()
        })
    }
}

const getDoctorsByOnlineStatus = () => {
    return ({ is_online, onSuccess, onFailure, onCompletion }: { is_online: number | null, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.medical.doctors_by_online_status}/${is_online}`
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
        submitAppointment, cancelAppointment, getMedicalHistory,
        getDoctorsByOnlineStatus, markDoctorFavourite, unMarkDoctorFavourite, postRating
    },
    { isAppLoading: true },
)