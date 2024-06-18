import { STORAGE_KEYS } from './globalVariables';

export function validateUserName(name: string) {
  return name.length > 2 && name[0].toUpperCase() === name[0];
}

export function validatePassword(password: string) {
  return password.length > 3 && /\d/.test(password);
}

export function saveLoginData(data: { name: string; password: string }) {
  sessionStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(data));
}

export function getLoginData(): { name: string; password: string } | null {
  const userData = sessionStorage.getItem(STORAGE_KEYS.userData);
  if (userData === null) return null;
  return JSON.parse(userData);
}

export function deleteLoginData() {
  sessionStorage.removeItem(STORAGE_KEYS.userData);
}

export function generateId() {
  return window.crypto.randomUUID();
}

export function removeChildElements<T extends HTMLElement>(parent: T) {
  while (parent.firstElementChild) {
    parent.firstElementChild.remove();
  }
}
