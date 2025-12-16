//Email Address Regex Pattern
export const userEmailAddressRegex: RegExp =
  /[a-zA-Z0-9]+@(test\.com|gmail\.com|outlook\.com|yahoo\.com|apple\.com|aol\.com|mail\.com|proton\.com|zoho\.com)/;

//Nist Compliant Password Regex Pattern //8 chars, 1 uppercase, 1 lowercase, 1 number, special chars enabled
export const userPasswordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
