

const routes = {

   patient: {
      index: 'patient',
      signin: 'patient/login',
      verify: 'patient/verify',
      register: 'patient/register',
      updateProfile: 'patient/profile/update',
      updateProfilePicture: 'patient',
      notifications: {
         all: 'patient/notifications',
         read: 'patient/notifications/read',
         unread: 'patient/notifications/unread',
         mark_as_read: 'patient/notifications/mark-as-read',
      }
   },

   doctor: {
      signin: 'doctor/login',
      verify: 'doctor/verify',
      register: 'doctor/register',
      is_verified: 'doctor/is-verified',
      complete_registration: 'doctor/profile/complete',
      updateProfile: 'doctor/profile/update',
      updateProfilePicture: 'doctor',
      languages: 'doctor/languages',
      specialties: 'doctor/specialties',
      calendar: 'doctor/schedule',
      notifications: {
         all: 'doctor/notifications',
         read: 'doctor/notifications/read',
         unread: 'doctor/notifications/unread',
         mark_as_read: 'doctor/notifications/mark-as-read',
      }
   },

   medical: {
      specialties: 'medical/specialties',
      doctors: 'medical/doctors',
      doctors_by_specialty: 'medical/doctors/specialty',
      history: 'medical-history/patient'
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