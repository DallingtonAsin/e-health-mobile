import React from 'react'

interface AppAction {
    type: string;
    payload?: any;
    authorization?: string;
    access_token?: string
}

interface DoctorIdentification {
    front: string,
    back: string
}

interface IUser {
    id?: number,
    first_name: string,
    last_name: string,
    specialty?: string,
    specialty_id?: number,
    email?: string,
    phone_number?: string,
    dob: string,
    gender: string,
    address?: string,
    primary_facility?: string,
    primary_facility_id?: number,
    other_facilities?: number[],
    qualification?: string,
    training_institute?: string,
    umdp_license_id?: string,
    bio_summary?: string,
    service_fee?: string,
    otp?: string,
    image?: string,
    identification_document?: DoctorIdentification | null
    is_patient?: boolean,
    profile_status?: boolean,
    is_registered?: boolean,
    is_verified?: boolean,
}

interface PatientRegistrationPayload {
    first_name: string,
    last_name: string,
    email?: string,
    address?: string,
    gender: string,
    dob: string,
    password: string,
    password_confirmation: string
}

interface DoctorRegistrationPayload {
    first_name: string,
    last_name: string,
    email: string,
    address?: string,
    gender: string,
    dob: string,
    password: string,
    password_confirmation: string
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
    unique_device_id?: string,
    device_token?: string,
    ip_address?: string
}

interface Notification {
    id: string,
    notifiable_id: number,
    data: any,
    read_at: any,
    read: boolean,
    is_appointment: boolean
}

interface MedicalHistoryRecord {
    id: number,
    patient_id: number,
    patient_name?: number,
    appointment_id: number,
    past_medical_history: string,
    current_treatment: string,
    illness: string,
    diagnosis_date: string,
    treatment: string,
}

interface NotificationStats {
    total: number,
    readCount: number,
    unreadCount: number
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
    gender: string,
    email?: string,
    address?: string,
    specialty?: string,
    primary_facility?: string,
    bio_summary: string,
    qualification: string,
    training_institute: string,
    facility: string,
    license_number?: string,
    image?: string,
    service_fee: number,
    schedule_dates?: string[],
    schedule?: string[],
    rating: number,
    thumbnail?: string,
    is_favourite: boolean,
    is_online: boolean
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
    reason: string,
    appointment_type: AppointmentType,
    appointment_date: string,
    appointment_time: string,
    status: string,
    is_expired: boolean,
}

interface AppointmentInfo {
    patient_id: any,
    doctor_id: number,
    appointment_type: string,
    appointment_date: string,
    appointment_time: string,
    reason: string,
    past_medical_history?: string,
    current_treatment?: string,
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

interface FileUpload {
    uri: any,
    source?: any,
    name?: any,
    type: any,
    size?: number,
    extension?: any,
}

interface Registration {
    patient: PatientRegistrationPayload,
    doctor: DoctorRegistrationPayload
}

interface DrCompleteProfilePayload {
    specialty: string,
    primary_facility: string,
    other_facilities: number[],
    address: string,
    bio_summary: string,
    qualification: string,
    training_institute: string,
    umdp_license_id: string,
    license_number?: string,
    service_fee: string,
    front_image: FileUpload,
    back_image: FileUpload
}

interface LoginPayload {
    country_code?: string,
    phone_number?: string,
    email?: string,
    password: string,
    current_version?: string,
    unique_device_id?: string,
    device_token?: string,
    ip_address?: string,
    is_phone_number_login: boolean
}

interface FacilityJson {
    key: number,
    value: string
}

interface PushNotification {
    title: string,
    body: string | any
    payload?: any,
}

interface AppointmentDetail {
    id: number,
    patient_id: number,
    doctor_id: number,
    appointment_number: string,
    appointment_type_id: number,
    appointment_date: string,
    reason: string,
    notes: string | null,
    status: string,
    confirmed_at: string,
    reminded_at: string,
    completed_at: string | null,
    rescheduled_at: string | null,
    cancelled_at: string | null,
    is_doctor_notified: number,
    alert_status: string,
    is_online: boolean,
    is_video: boolean,
    appointment_time: string,
    patient: {
        id: number,
        first_name: string,
        last_name: string,
        country_code: string,
        phone_number: string,
        email: string,
        address: string,
        dob: string,
        age: string,
        image: string,
        thumbnail: string
    },
    doctor: {
        id: number,
        first_name: string,
        last_name: string,
        specialty_id: number,
        primary_facility_id: number,
        country_code: string,
        phone_number: string,
        email: string,
        qualification: string,
        address: string,
        image: string,
        service_fee: string,
        fcm_token: string | null,
        thumbnail: string
        specialty: string,
        primary_facility: string,
        is_online: boolean
    },
    appointment_type: {
        id: number,
        name: string
    },
    meeting_access: {
        appId: string,
        channel: string,
        token: string
    },
    medical_history: {
        id: number,
        patient_id: number,
        appointment_id: number,
        past_medical_history: string | null,
        current_treatment: string | null,
        illness: string | null,
        diagnosis_date: string | null,
        treatment: string | null
    }
}

type setPasswordError = React.Dispatch<React.SetStateAction<string>>;


export type {
    AppAction,
    IUser,
    Drug,
    LoginData,
    FacilityJson,
    SignedinUser,
    Notification,
    NotificationStats,
    MedicalSpecialty,
    DoctorsDetail,
    PatientDetail,
    AppointmentType,
    AppointmentInfo,
    DoctorCalendar,
    MyAppointmentInfo,
    agoraConnection,
    MedicalHistoryRecord,
    FileUpload,
    PatientRegistrationPayload,
    DoctorRegistrationPayload,
    Registration,
    setPasswordError,
    LoginPayload,
    PushNotification,
    AppointmentDetail,
    DrCompleteProfilePayload
}