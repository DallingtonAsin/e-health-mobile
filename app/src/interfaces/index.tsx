interface IUser {
    first_name: string,
    last_name: string,
    email?: string,
    dob: string,
    gender: string,
    address: string
}

interface User {
    first_name: string,
    last_name: string,
    email?: string,
    phone_number: string,
    dob: string,
    gender: string,
    address: string,
    otp: string,
    profile_status: boolean,
    image?: string | ''
}

interface SignedinUser {
    user: User,
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
    qualification: string | '',
    profession: string,
    title: string,
    experience: string,
    languages: string,
    image: string,
    service_fee: number,
}

interface CommunicationType {
    id: number,
    name: string
}

interface MyAppointmentInfo {
    id: number,
    drImage: string,
    drName: string,
    city: string,
    address: string,
    consultationReason: string,
    date: string,
    time: string,
    status: boolean,
    statusText: string,
    type: string,
}

export type {
    IUser,
    LoginData,
    SignedinUser,
    Notification,
    MedicalSpecialty,
    DoctorsDetail,
    CommunicationType,
    MyAppointmentInfo
}