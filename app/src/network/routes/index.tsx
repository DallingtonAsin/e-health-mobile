

const routes = {

   patient: {
    signin: 'patient/login',
    verify: 'patient/verify',
    register: 'patient/register',
    updateProfile: 'patient/profile/update',
   },

   medical: {
      specialties: 'medical/specialties',
      doctors: 'medical/doctors',
      doctors_by_specialty: 'medical/doctors/specialty',
   },

   appointments: {
      index: 'appointments',
      cancel: 'appointments/cancel',
      types: 'appointments/types',
      patient: {
         myappointments: 'appointments/patient',
      }
   }


}

export { routes }