

export const removeLeadingZeros = (number: string) => {
  if (number) {
    while (number.charAt(0) === '0') {
      number = number.substring(1);
    }
    return number;
  }
}

export const getGreeting = () => {

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