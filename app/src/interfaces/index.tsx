
interface IUser {
    id?: number,
    first_name: string,
    last_name: string,
    specialty?:string,
    email?: string,
    phone_number?: string,
    dob: string,
    gender: string,
    address: string,
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

interface AppointmentType {
    id: number,
    name: string
}

interface MyAppointmentInfo {
    id: number,
    doctor: DoctorsDetail,
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

export type {
    IUser,
    LoginData,
    SignedinUser,
    Notification,
    MedicalSpecialty,
    DoctorsDetail,
    AppointmentType,
    AppointmentInfo,
    MyAppointmentInfo
}