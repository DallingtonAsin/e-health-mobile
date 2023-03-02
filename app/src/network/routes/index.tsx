

const routes = {

   patient: {
    signin: 'patient/login',
    verify: 'patient/verify',
    register: 'patient/register',
    updateProfile: 'patient/profile/update',
    updateProfilePicture: 'patient',
   },

   doctor: {
      signin: 'doctor/login',
      register: 'doctor/register',
      updateProfile: 'doctor/profile/update',
      updateProfilePicture: 'doctor',
      languages: 'doctor/languages',
      specialties: 'doctor/specialties',
      calendar: 'doctor/schedule',
     },

   medical: {
      specialties: 'medical/specialties',
      doctors: 'medical/doctors',
      doctors_by_specialty: 'medical/doctors/specialty',
   },

   drugs: {
      index: 'drugs',
   },

   appointments: {
      index: 'appointments',
      cancel: 'appointments/cancel',
      types: 'appointments/types',
      meeting: 'appointments/meeting',
      patient: {
         myappointments: 'appointments/patient',
      },
      doctor: {
         myappointments: 'appointments/doctor',
      }
   }


}

export { routes }