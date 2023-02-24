
interface AppAction {
    type: string;
    payload?: any;
}

interface IUser {
    id?: number,
    first_name: string,
    last_name: string,
    specialty?: string,
    specialty_id?: string,
    email?: string,
    phone_number?: string,
    dob: string,
    gender: string,
    address?: string,
    title?: string,
    qualification?: string,
    profession?: string,
    languages?: string[],
    experience?: string,
    service_fee?: string,
    otp?: string,
    profile_status?: boolean,
    image?: string,
    is_patient?: boolean,
}

interface SignedinUser {
    user: IUser,
    authorization: string,
    token?: string,
}


interface LoginData {
    country_code: string,
    phone_number: string,
    current_version: string,
}

interface Notification {
    id: number,
    message: string,
}

interface MedicalSpecialty {
    id: number,
    name: string,
}

interface DoctorsDetail {
    id: number,
    first_name: string,
    last_name: string,
    country_code?: string,
    phone_number: string,
    qualification?: string,
    profession: string,
    title: string,
    experience: string,
    languages?: string,
    image?: string,
    service_fee: number,
    schedule_dates?: string[],
    schedule?: string[],
}

interface PatientDetail {
    id?: number,
    first_name: string,
    last_name: string,
    country_code?: string,
    phone_number: string,
    email?: string,
    address?: string,
    dob?: string
}

interface AppointmentType {
    id: number,
    name: string
}

interface MyAppointmentInfo {
    id: number,
    doctor: DoctorsDetail,
    patient: PatientDetail,
    symptoms: string,
    appointment_type: AppointmentType,
    appointment_date: string,
    appointment_time: string,
    status: string,
}

interface AppointmentInfo {
    patient_id: any,
    doctor_id: number,
    appointment_type: string,
    appointment_date: string,
    appointment_time: string,
    symptoms: string,
    notes?: string,
}

interface DoctorCalendar {
    id: number,
    doctor_id?: number,
    date: string,
    start_time: string,
    end_time: string
}

interface agoraConnection {
    appId: string,
    channel: string,
    token: string
}

interface Drug {
    id: number,
    name: string,
    description?: string,
    price: number,
    formatted_price?: string,
    image: string,
    status: string,
    quantity: number | 0,
    in_stock: boolean

}

export type {
    AppAction,
    IUser,
    Drug,
    LoginData,
    SignedinUser,
    Notification,
    MedicalSpecialty,
    DoctorsDetail,
    PatientDetail,
    AppointmentType,
    AppointmentInfo,
    DoctorCalendar,
    MyAppointmentInfo,
    agoraConnection
}