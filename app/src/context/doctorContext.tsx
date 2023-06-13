import createDataContext from './createDataContext';
import { routes } from '../network/routes';
import Service from '../network/services/httpService';
import { IUser, LoginData } from '../interfaces';
import { storeUser, storeAuthToken, storeAccessToken } from '../network/services/asyncStorageService';
import { appReducer } from './reducers/appReducer';
import { displayErrorMessage } from '../components/common/SharedHelper';
import * as types from './actions';

const services = new Service();


const authenticateDoctor = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: LoginData, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.doctor.signin,
            payload
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data;
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


const completeRegistration = (dispatch: any) => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: FormData, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.post(
            routes.doctor.complete_registration,
            payload,
            true
        ).then(async (res) => {
            if (res && res.data) {

                const data = res.data
                const user = data.user
                const message = data.message

                await storeAccessToken(user.access_token);
                await storeUser(user);

                dispatch({
                    type: types.HOME,
                    payload: user
                });

                onSuccess(message);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const confirmAppointment = () => {
    return ({ payload, onSuccess, onFailure, onCompletion }: { payload: any, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.put(
            routes.appointments.confirm,
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

const getDoctorInfo = () => {
    return ({ doctorId, onSuccess, onFailure, onCompletion }: { doctorId: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            `${routes.medical.doctors}/${doctorId}`
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data;
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
                const data = res.data;
                onSuccess(data);
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

const isVerified = (dispatch: any) => {
    return ({ screen, onSuccess, onFailure, onCompletion }: { screen: string, onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.doctor.is_verified
        ).then(async (res) => {

            let user = res.data;
            if (user && user.is_verified) {
                await storeAccessToken(user.access_token);
                await storeUser(user);
                dispatch({
                    type: types.HOME,
                    payload: user
                });

                onSuccess(screen);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const updateOnlineStatus = (dispatch: any) => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.put(
            routes.doctor.update_online_status,
            {}
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data;
                const user = data.user;
                const message = data.message;
                await storeAccessToken(user.access_token);
                await storeUser(user);
                dispatch({
                    type: types.HOME,
                    payload: user
                });
                onSuccess(message);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const changeAutoApproveAppointmentStatus = (dispatch: any) => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.put(
            routes.doctor.update_auto_approve_status,
            {}
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data;
                const user = data.user;
                const message = data.message;
                await storeAccessToken(user.access_token);
                await storeUser(user);
                dispatch({
                    type: types.HOME,
                    payload: user
                });
                onSuccess(message);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};


const getMedicalDoctors = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.medical.doctors
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const getMedicalFacilities = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.medical.facilities
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const getLabTestCategories = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.doctor.lab_test_categories
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data;
                onSuccess(data);
            }
        }).catch((error) => {
            displayErrorMessage(error, onFailure);
        }).finally(() => {
            onCompletion();
        });
    };
};

const getIcd10Codes = () => {
    return ({ onSuccess, onFailure, onCompletion }: { onSuccess: any, onFailure: any, onCompletion: any }) => {
        services.get(
            routes.doctor.icd_10_codes
        ).then(async (res) => {
            if (res && res.data) {
                const data = res.data;
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
        authenticateDoctor, completeRegistration, confirmAppointment, getDoctorInfo, getDoctorsCalendar, getMedicalDoctors,
        getMedicalFacilities, submitDoctorSchedule, completeAppointment, isVerified, updateOnlineStatus, changeAutoApproveAppointmentStatus,
        getLabTestCategories, getIcd10Codes
    },
    { isAppLoading: true },
);