import createDataContext from './createDataContext';
import { routes } from '../network/routes';
import Service from '../network/services/httpService';
import { AppointmentInfo } from '../interfaces';
import { appReducer } from './reducers/appReducer';
import { displayErrorMessage } from '../components/common/SharedHelper';

const services = new Service();

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

const getMedicalHistory = () => {
    return ({ patient_id, onSuccess, onFailure, onCompletion }: { patient_id: number, onSuccess: any, onFailure: any, onCompletion: any }) => {
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

export const { Provider, Context } = createDataContext(
    appReducer,
    {
         submitAppointment, cancelAppointment, getMedicalHistory
    },
    { isAppLoading: true },
);