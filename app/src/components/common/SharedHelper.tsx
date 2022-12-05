

export const removeLeadingZeros = (number: string) => {
    if(number){
        while(number.charAt(0) === '0') {
            number = number.substring(1);
          }
          return number;
    }
  }