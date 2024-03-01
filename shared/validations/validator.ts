class SafeValidator {
  static validateEmail(email: string): boolean {
    // Use regular expression for email validation
    return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(email);
  }

  // Use regular expression for phone number validation
  static validatePhoneNumber(phoneNumber: string): boolean {
    const regex = /^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return regex.test(phoneNumber);
  }


  //   validate company name so that it does not contain any special characters and is of given length

  static validateCompanyName(companyName: string, maxLength: number): boolean {
    // checks if the company name is not empty and is of given length
    if (companyName.length > maxLength || companyName.length === 0) {
      return false;
    }

    const regex = /^[a-zA-Z0-9\s.]+$/;

    return regex.test(companyName);
  }

  //   validate address so that it does not contain any special characters and is of given length
  
  static validateAddress(address: string): boolean {
    // Use regular expression for address validation
    if (address.length === 0) {
      return false;
    }

    const regex = /^[a-zA-Z0-9\s]+$/;

    return regex.test(address);
  }

  // validate userType so that it is either worker or supervisor
  static validateUserType(userType: string): boolean {
    return userType === 'worker' || userType === 'supervisor' || userType === 'admin';
  }
}

export default SafeValidator;
