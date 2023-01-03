import { compose, groupBy, sort, descend, last, splitEvery, flatten, sortBy, prop, pipe, countBy, identity, F, forEach } from 'ramda';
import { collection, getDocs, doc, getDoc, deleteDoc, query } from "firebase/firestore";
var Diacritics = require('diacritic');
import { db } from './firebase';



export async function notifyNewUserSignup(user) {
  const idtoken = await user.getIdToken();
  const result = await fetch(
    `/api/sendemail`,
    {
      method: 'POST',
      body: JSON.stringify({
        subject: 'New user signup on AVTATour.com',
        from: 'noreply@avtatour.com',
        to: ['nvhoanganh1909@gmail.com', 'tony.tuanphan@gmail.com'],
        text: `New user ${user.displayName} (${user.email}) just signed up on AVTATOUR.com`,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idtoken}`,
      },
    }
  );
  const resultJSON = await result.json();
  console.log("🚀 ~ file: notificationservice.js:26 ~ notifyNewUserSignup ~ resultJSON", resultJSON)
  return resultJSON;
};

export async function notifyWelcomeUser(user) {
  const idtoken = await user.getIdToken();
  const result = await fetch(
    `/api/sendemail`,
    {
      method: 'POST',
      body: JSON.stringify({
        from: 'noreply@avtatour.com',
        to: user.email,
        templateId: 'd-b163067c98c74353bb7a8591446765d2',
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idtoken}`,
      },
    }
  );
  const resultJSON = await result.json();
  console.log("🚀 ~ file: notificationservice.js:26 ~ notifyNewUserSignup ~ resultJSON", resultJSON)
  return resultJSON;
};