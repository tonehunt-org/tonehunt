import { compact } from "lodash";
import get from "lodash/get";
import set from "lodash/set";
import { asArray } from "./array";

// FormData can be a single value or multiple values per key. This detects if the key is
// has multiple values
function detectFormAppends(formData: FormData) {
  let previousKey;
  let appends = new Set();

  for (let [key] of formData) {
    if (key === previousKey) {
      appends.add(key);
    }

    previousKey = key;
  }

  return appends;
}

export function toJSON<T>(formData: FormData): T {
  let formObject = {};

  const formAppends = detectFormAppends(formData);

  for (let [key, value] of formData) {
    const currentValue = get(formObject, key);
    const actualValue = formAppends.has(key) ? asArray(currentValue).concat(value) : value;

    set(formObject, key, actualValue);
  }

  for (const key in formObject) {
    const value = (formObject as any)[key];
    if (Array.isArray(value)) {
      set(formObject, key, compact(value));
    }
  }

  return formObject as T;
}
