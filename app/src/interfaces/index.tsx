import React from 'react'

interface AppAction {
    type: string;
    payload?: any;
    authorization?: string;
    access_token?: string
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
    facility?: string,
    qualification?: string,
    training_institute?: string,
    license_number?: string,
    service_fee?: string,
    otp?: string,
    profile_status?: boolean,
    image?: string,
    is_patient?: boolean,
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
    read?: boolean,
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
    name: any,
    type: any
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
    license_number: string,
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

type setPasswordError = React.Dispatch<React.SetStateAction<string>>;


export type {
    AppAction,
    IUser,
    Drug,
    LoginData,
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
    DrCompleteProfilePayload
}