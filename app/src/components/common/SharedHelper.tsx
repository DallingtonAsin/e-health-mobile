import Toast from 'react-native-simple-toast';
import { MAJOR_VERSION, MINOR_VERSION, PATCH_VERSION,PRE_RELEASE } from '@env';

const removeLeadingZeros = (number: string) => {
  if (number) {
    while (number.charAt(0) === '0') {
      number = number.substring(1);
    }
    return number;
  }
}

const getGreeting = () => {

  let greeting = '';
  const date = new Date();
  const hour = date.getHours();

  switch (true) {
    case hour < 12:
      greeting = 'Good Morning'
      break;
    case hour >= 12 && hour < 17:
      greeting = 'Good afternoon'
      break;
    case hour >= 17:
      greeting = 'Good evening'
      break;
  }

  return greeting;
}

const formatDate = (date: Date) => {
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - (offset * 60 * 1000))
  let formattedDate = date.toISOString().split('T')[0];
  return formattedDate;
}

const displayMessage = (message: any) => {
  Toast.show(message, Toast.LONG);
}

const displayErrorMessage = (error: any, onFailure: any) => {
  let message;
  if (error && error.response) {
    message = error.response.data.message;
  } else if (error.message) {
    message = String(error.message);
  } else if (error.error) {
    message = String(error.error);
  } else {
    message = String(error);
  }

  onFailure(message);
}


const getUserInitials = (name: string) => {
  if (name) {
    return name.split(" ").map((n) => n[0]).join("");
  }
  return name;
}

const getCurrentDate = () => {
  const date = new Date();
  const formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0');
  return formattedDate;
}

const readableDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const options: any = { weekday: 'short', day: 'numeric', month: 'long' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
}

const readableTime = (timeStr: any) => {
  const date = new Date(`1970-01-01T${timeStr}:00`);
  const options: any = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedTime = date.toLocaleTimeString('en-US', options);
  return formattedTime
}

const strContains = (str: string, substr: string) => {
  return str.toLocaleLowerCase().indexOf(substr.toLocaleLowerCase()) !== -1
}

const getDayMonth = (date: string) => {
  const dateObject = new Date(date);
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObject);
  return [day, monthName];
}

const isValidEmail = (email: any) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const getJsonObjByValue = (arr: any, value: any) => {
  let result = arr.filter(function (obj: any) {
    return obj.value === value;
  });
  return result[0];
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const isValidDob = (birthdateStr: string) => {
  const birthdate = new Date(birthdateStr);
  const today: any = new Date();

  const ageDiffMs = today - birthdate.getTime();
  const ageDate = new Date(ageDiffMs);

  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  return age >= 18
}

const getAppVersion = () => {
  let version = `${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}`;
  if (PRE_RELEASE) {
    version = version.concat(`-${PRE_RELEASE}`);
  }
  return version;
};

export {
  removeLeadingZeros,
  getGreeting,
  displayMessage,
  formatDate,
  displayErrorMessage,
  getUserInitials,
  getCurrentDate,
  readableDate,
  readableTime,
  strContains,
  getDayMonth,
  isValidEmail,
  isValidDob,
  getJsonObjByValue,
  getAppVersion,
  numberWithCommas
}