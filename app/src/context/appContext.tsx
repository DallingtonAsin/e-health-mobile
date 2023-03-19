import createDataContext from './createDataContext';
import { routes } from '../network/routes';
import Service from '../network/services/httpService';
import { IUser, AppointmentInfo, LoginData } from '../interfaces';
import { storeUser, storeAuthToken, storeAccessToken, removeAuthToken, removeAccessToken } from '../network/services/asyncStorageService';
import { appReducer } from './appReducer';
import { initialUserState } from '../configs/constants';
import { displayErrorMessage } from '../components/common/SharedHelper';
import * as types from './actions';
import { setNotifications } from '../redux/features/notificationSlice';

const services = new Service();

const signin = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: LoginData, onSuccess: any, onFailure: any, onCompletion: any }) => {

        services.post(
            routes.patient.signin,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                await storeAuthToken(data.access_token);

                dispatch({
                    type: types.USER_SIGNIN,
                    payload: data
                });

                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};


const verifyCode = (dispatch: any) => {
    return ({ code, onSuccess, onFailure, onCompletion }: { code: string, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.patient.verify,
            { otp: code }
        ).then(async (res) => {

            if (res && res.data) {

                let data = res.data;
                let access_token = data.access_token;
                await storeAuthToken(access_token);

                if (data.profile_status == 1) {
                    await storeAccessToken(access_token);
                    await storeUser(data);
                    dispatch({
                        type: types.HOME,
                        payload: data
                    });
                } else {
                    dispatch({
                        type: types.USER_SIGNUP,
                        payload: data
                    });
                }

                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const signup = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.patient.register,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;

                await storeAccessToken(data.access_token);
                await storeUser(data);

                dispatch({
                    type: types.HOME,
                    payload: data
                });

                onSuccess();
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

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

const getDoctorInfo = () => {
    return ({ doctorId, onSuccess, onFailure, onCompletion }: { doctorId: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.medical.doctors}/${doctorId}`
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

const submitAppointment = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: AppointmentInfo, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.appointments.index,
            payload
        ).then(async (res: any) => {
            if (res && res.data) {
                onSuccess(res.data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const cancelAppointment = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.put(
            routes.appointments.cancel,
            payload
        ).then(async (res: any) => {
            if (res && res.data && res.data.message) {
                let message = res.data.message;
                onSuccess(message);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const completeAppointment = () => {
    return ({ appointment_id, payload, onSuccess, onFailure, onCompletion }: { appointment_id: number, payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.put(
            `${routes.appointments.index}/${appointment_id}/complete`,
            payload
        ).then(async (res: any) => {
            if (res && res.data && res.data.message) {
                let message = res.data.message;
                onSuccess(message);
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

const authenticateDoctor = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: LoginData, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.doctor.signin,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                let access_token = data.access_token;
                await storeAuthToken(access_token);

                if (data.profile_status == 1) {
                    await storeAccessToken(access_token);
                    await storeUser(data);
                    dispatch({
                        type: types.HOME,
                        payload: data
                    });
                } else {
                    dispatch({
                        type: types.USER_SIGNUP,
                        payload: data
                    });
                }

                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const registerDoctor = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: IUser, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.doctor.register,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                let data = res.data;
                await storeAccessToken(data.access_token);
                await storeUser(data);

                dispatch({
                    type: types.HOME,
                    payload: data
                });

                onSuccess();
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

const getDoctorsCalendar = () => {
    return ({ doctor_id, onSuccess, onFailure, onCompletion }: { doctor_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.doctor.calendar}/${doctor_id}`
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

const submitDoctorSchedule = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.doctor.calendar,
            payload
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

const getNotifications = (dispatch: any) => {
    return ({ is_patient, onFailure, onCompletion }: { is_patient: boolean, onFailure: any, onCompletion: any }) => {
        const endpoint = is_patient ? routes.patient.notifications.all : routes.doctor.notifications.all;
        services.get(
            endpoint
        ).then(async (res) => {
            if (res && res.data) {
                let data = res.data;
                dispatch(setNotifications(data.notifications));
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

const getMedicalHistory = () => {
    return ({ patient_id, onSuccess, onFailure, onCompletion }: {patient_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.medical.history}/${patient_id}`
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

export const { Provider, Context, } = createDataContext(
    appReducer,
    {
        signin, verifyCode, signup, updateProfile, getMedicalSpecialties, getDoctorsBySpecialty, getDoctorInfo, getDrugs, getMeetingDetails,
        getAppointmentTypes, submitAppointment, getMyAppointments, cancelAppointment, signout, authenticateDoctor, deleteProfileImage,
        registerDoctor, getDoctorLanguages, getDoctorSpecialties, getDoctorsCalendar, submitDoctorSchedule, updateProfileImage, completeAppointment,
        getNotifications, markNotificationRead, getMedicalHistory
    },
    { user: initialUserState, token: '', authorization: '', isAppLoading: true },
);