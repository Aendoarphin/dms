// Global variables

export const passwordMinLength = 8;
export const passwordPattern = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"; //eslint-disable-line
export const passwordTitle = "Password must at least 8 characters, contain at least one uppercase letter, one number, and one special character.";