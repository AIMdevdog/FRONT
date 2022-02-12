import ExpiredStorage from "expired-storage";
import moment from "moment";
const expiredStorage = new ExpiredStorage(sessionStorage);

export const localSetItem = (key, data, expiration) => {
  const result = {
    value: data,
    ttl: moment().unix() + expiration * 60,
  };

  localStorage.setItem(key, JSON.stringify(result), expiration * 60);
};

export const localGetItem = (keyName) => {
  const data = localStorage.getItem(keyName);

  if (!data) {
    return null;
  }

  const item = JSON.parse(data);

  if (moment().unix() > item.ttl) {
    localStorage.removeItem(keyName);
    return null;
  }
  // return data if not expired
  return item.value;
};

export const getItem = (key) => {
  // return sessionStorage.getItem(key);
  return expiredStorage.getItem(key);
};

export const setItem = (key, data, expiration) => {
  // sessionStorage.setItem(
  //     key,
  //     typeof data === 'string' ? data : JSON.stringify(data),
  // );

  expiredStorage.setItem(
    key,
    typeof data === "string" ? data : JSON.stringify(data),
    expiration * 60
  ); // expiration은 second
};

export const removeItem = (key) => {
  localStorage.removeItem(key);
  // sessionStorage.removeItem(key);
};
