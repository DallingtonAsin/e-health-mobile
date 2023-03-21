import createDataContext from './createDataContext';
import { routes } from '../network/routes';
import Service from '../network/services/httpService';
import { IUser } from '../interfaces';
import { storeUser, storeAccessToken, removeAuthToken, removeAccessToken } from '../network/services/asyncStorageService';
import { appReducer } from './reducers/appReducer';
import { initialUserState } from '../configs/constants';
import { displayErrorMessage } from '../components/common/SharedHelper';
import * as types from './actions';

const services = new Service();

const updateProfile = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => {
        let endpoint = payload.is_patient ? routes.patient.updateProfile : routes.doctor.updateProfile;
        services.post(
            endpoint,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                let user = data.user;
                let message = res.data.message;

                await storeAccessToken(user.access_token);
                await storeUser(user);

                dispatch({
                    type: types.HOME,
                    payload: user
                });

                onSuccess(user, message);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const updateProfileImage = (dispatch: any) => {
    return ({ user, payload, onSuccess, onFailure, onCompletion }: { user: any, payload: FormData, onSuccess: any, onFailure: any, onCompletion: any }) => {
        let endpoint = user.is_patient ? routes.patient.updateProfilePicture : routes.doctor.updateProfilePicture;

        services.post(
            `${endpoint}/${user.id}/profile-picture`,
            payload,
            true
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                let user = data.user;
                let message = res.data.message;

                await storeAccessToken(user.access_token);
                await storeUser(user);

                dispatch({
                    type: types.HOME,
                    payload: user
                });

                onSuccess(user, message);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const deleteProfileImage = (dispatch: any) => {
    return ({ user, onSuccess, onFailure, onCompletion }: { user: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        let endpoint = user.is_patient ? routes.patient.updateProfilePicture : routes.doctor.updateProfilePicture;

        services.delete(
            `${endpoint}/${user.id}/profile-picture/delete`
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                let user = data.user;
                let message = res.data.message;

                await storeAccessToken(user.access_token);
                await storeUser(user);

                dispatch({
                    type: types.HOME,
                    payload: user
                });

                onSuccess(user, message);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};


const getMedicalSpecialties = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.medical.specialties
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const getDoctorsBySpecialty = () => {
    return ({ specialtyId, onSuccess, onFailure, onCompletion }: { specialtyId: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.medical.doctors_by_specialty}/${specialtyId}`
        ).then(async (res) => {
            if (res && res.data) {
                let data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const getAppointmentTypes = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.appointments.types
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const getMeetingDetails = () => {
    return ({ appointmentId, onSuccess, onFailure, onCompletion }: { appointmentId: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.appointments.meeting}/${appointmentId}`
        ).then(async (res) => {
            if (res && res.data) {
                let data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};


const getMyAppointments = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        let endpoint = payload.is_patient ? routes.appointments.patient.myappointments : routes.appointments.doctor.myappointments;
        services.get(
            `${endpoint}/${payload.user_id}/${payload.path}`
        ).then(async (res) => {
            if (res && res.data) {
                let data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const signout = (dispatch: any) => {
    return async () => {
        await removeAuthToken();
        await removeAccessToken();
        dispatch({
            type: types.USER_SIGNOUT,
            payload: { isAppLoading: false }
        });
    };
};


const getDoctorSpecialties = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.doctor.specialties}`
        ).then(async (res) => {
            if (res && res.data) {
                let data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};


const getDrugs = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.drugs.index
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const getNotifications = () => {
    return ({ is_patient, onSuccess, onFailure, onCompletion }: { is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? routes.patient.notifications.all : routes.doctor.notifications.all;
        services.get(
            endpoint
        ).then(async (res) => {
            if (res && res.data) {
                let data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const markNotificationRead = () => {
    return ({ notification_id, is_patient, onSuccess, onFailure, onCompletion }: { notification_id: string, is_patient: boolean, onSuccess: any, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? `${routes.patient.notifications.mark_as_read}/${notification_id}` : `${routes.doctor.notifications.mark_as_read}/${notification_id}`;
        services.post(
            endpoint,
            {}
        ).then(async (res) => {
            if (res && res.data) {
                onSuccess(res.data.message);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const getDoctorLanguages = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.doctor.languages}`
        ).then(async (res) => {
            if (res && res.data) {
                let data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

export const { Provider, Context } = createDataContext(
    appReducer,
    {
        updateProfile, getMedicalSpecialties, getDoctorsBySpecialty, getDrugs, getMeetingDetails,
        getAppointmentTypes, getMyAppointments, signout, deleteProfileImage, getDoctorSpecialties, updateProfileImage,
        getDoctorLanguages, getNotifications, markNotificationRead
    },
    { user: initialUserState, token: '', authorization: '', isAppLoading: true },
);