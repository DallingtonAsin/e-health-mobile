import Toast from 'react-native-simple-toast';

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
  date = new Date(date.getTime() - (offset*60*1000))
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
  } else {
      message = String(error);
  }

  onFailure(message);
}


const getUserInitials = (name: string) => {
     if(name){
      return name.split(" ").map((n)=>n[0]).join("");
     }
    return name;
}


export {
   removeLeadingZeros,
   getGreeting,
   displayMessage,
   formatDate,
   displayErrorMessage,
   getUserInitials
}