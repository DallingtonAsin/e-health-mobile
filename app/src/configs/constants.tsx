
  import { SignedinUser, DoctorsDetail } from "../interfaces";

  const initialUser = {
    first_name: '',
    last_name: '',
    email: '',
    country_code: '',
    phone_number: '',
    dob: '',
    gender: '',
    address: '',
    otp: '',
    profile_status: false,
  }
  
  const initialUserState: SignedinUser = {
    user: initialUser,
    authorization: '',
    token: '',
  }

  const initialSpecialities: DoctorsDetail[] = [
    { id: 1, first_name: 'Anthony', last_name: 'Luna', phone_number: '+256780225155', qualification: 'MBBS, DNB', profession: 'Dentist', title: 'Dr.', experience: `5 Yrs`, languages: `English, Swahili, Luganda`, image: 'https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg', service_fee: 800 },
    { id: 2, first_name: 'Grace ', last_name: 'Kaisa', phone_number: '0700477421', qualification: 'MBBS, DNB', profession: 'Nutrionist', title: 'Dr.', experience: `3 Yrs`, languages: `English, Luganda`, image: 'https://thumbs.dreamstime.com/b/smiling-female-doctor-holding-medical-records-lab-coat-her-office-clipboard-looking-camera-56673035.jpg', service_fee: 330 },
    { id: 3, first_name: 'Herman', last_name: 'Keid', phone_number: '0774014727', qualification: 'MBBS, DNB', profession: 'Dietitian', title: 'Dr.', experience: `1 Yr`, languages: `English, Luo, Luganda`, image: 'https://t4.ftcdn.net/jpg/03/16/76/11/360_F_316761139_yVmLRT0AVwpZwOTgpmfrdIKrtFfg0bop.jpg', service_fee: 450 },
    { id: 4, first_name: 'Dallington', last_name: 'Lisa', phone_number: '0700477421', qualification: 'MBBS, DNB', profession: 'Orthoptist', title: 'Dr.', experience: `4 Yrs`, languages: `English, Runyankore, Luganda`, image: 'https://thumbs.dreamstime.com/b/portrait-positive-black-doctor-holding-medical-chart-male-over-white-background-178499631.jpg', service_fee: 500 },
    { id: 5, first_name: 'John', last_name: 'Peterson', phone_number: '0700477421', qualification: 'MBBS, DNB', profession: 'Nurse', title: 'Dr.', experience: `10 Yrs`, languages: `English, Luganda`, image: 'https://st.depositphotos.com/1770836/1357/i/950/depositphotos_13576597-stock-photo-female-doctor-or-nurse.jpg', service_fee: 800 },
    { id: 6, first_name: 'Chelsea', last_name: 'Finn', phone_number: '0700477421', qualification: 'MBBS, DNB', profession: 'Physical therapist', title: 'Dr.', experience: `2 Yrs`, languages: `English, Swahili`, image: 'https://static2.bigstockphoto.com/4/7/3/large1500/374246794.jpg', service_fee: 650 },
    { id: 7, first_name: 'Moses', last_name: 'Alfred', phone_number: '0774014727', qualification: 'MBBS, DNB', profession: 'Surgical first assistant', title: 'Dr.', experience: `3 Yrs`, languages: `Swahili, Luganda`, image: 'https://www.shape.com/thmb/3BaNRJiYmLa4HCkvORgFpj7c1Xo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/black-female-doctor-6d6a6c2ec3ae48ceaeeae61f78b7038e.jpg', service_fee: 250 },
    { id: 8, first_name: 'Peterson ', last_name: 'Lkein', phone_number: '0700477421', qualification: 'MBBS, DNB', profession: 'Phlebotomy technician', title: 'Dr.', experience: `6 Yrs`, languages: `English, German, Luganda`, image: 'https://purepng.com/public/uploads/large/purepng.com-doctorsdoctorsdoctors-and-nursesa-qualified-practitioner-of-medicine-aclinicianmedical-practitionermale-doctor-1421526856715fcree.png', service_fee: 150 },
    { id: 9, first_name: 'Ivan', last_name: 'Luna', phone_number: '0700477421', qualification: 'MBBS, DNB', profession: 'Medical physicist', title: 'Dr.', experience: `2 Yrs`, languages: `English, Spanish, Swahili`, image: 'https://www.pngfind.com/pngs/m/53-531148_black-doctor-png-black-medical-doctor-png-transparent.png', service_fee: 980 },
    { id: 10, first_name: 'Isaac', last_name: 'Newton', phone_number: '0774014727', qualification: 'MBBS, DNB', profession: 'Orthoptist', title: 'Dr.', experience: `7 Yrs`, languages: `English`, image: 'https://www.seekpng.com/png/full/13-132502_alligator-black-male-doctor-png.png', service_fee: 160 },
    { id: 11, first_name: 'Hamson', last_name: 'Wilson', phone_number: '0700477421', qualification: 'MBBS, DNB', profession: 'Nutrionist', title: 'Dr.', experience: `8 Yrs`, languages: `Spanish, Luo, Luganda`, image: 'https://pngimg.com/uploads/doctor/doctor_PNG15957.png', service_fee: 115 },
    { id: 12, first_name: 'Allen', last_name: 'Kemi', phone_number: '0774014727', qualification: 'MBBS, DNB', profession: 'Nurse', title: 'Dr.', experience: `2 Yrs`, languages: `English, Runyankore`, image: 'https://i.pinimg.com/originals/5b/a1/a3/5ba1a398ac0aa7fe01480166fd2b818f.png', service_fee: 175 },
]

export  { initialUserState, initialSpecialities }