import { useEffect, useRef } from "react";

export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const validateString = (data: string) => {
  return data.trim().length > 0 && /^[A-Za-z]+$/.test(data);
}

export const validatePhoneNumber = (phoneNumber: string) => {
  return phoneNumber.match(
    /^\d{10}$/
  );
};

export function useUpdateEffect(effect: () => void, dependencies: any[] = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}

export interface ProfileData {
  profileImage: string;
  profileEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  orderStatus: boolean;
  passwordChanges: boolean;
  specialOffers: boolean;
  newsLetters: boolean;
}