export function validateUserName(name: string) {
  return name.length > 3;
}

export function validatePassword(password: string) {
  return password.length > 3 && /\d/.test(password);
}
