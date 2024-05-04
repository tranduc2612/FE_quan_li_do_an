
// import { getAuth } from "firebase/auth";
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBfWAF4W0JA4GRaPSR3xpKQRnO5xj9IGRI",
//     authDomain: "otpphone-2d909.firebaseapp.com",
//     projectId: "otpphone-2d909",
//     storageBucket: "otpphone-2d909.appspot.com",
//     messagingSenderId: "912715143812",
//     appId: "1:912715143812:web:f4011436b934ed2a4b80d1",
//     measurementId: "G-KF2Q0ZT1V1"
//   };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const auth = getAuth(app);

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBnTMcCyUu7QQ_9qWdpO47OfzELBk4G7pU",
//     authDomain: "otp-authen-a2eaf.firebaseapp.com",
//     projectId: "otp-authen-a2eaf",
//     storageBucket: "otp-authen-a2eaf.appspot.com",
//     messagingSenderId: "808609410010",
//     appId: "1:808609410010:web:f18a09c83f9e8ed181eee3",
//     measurementId: "G-QCSLTN9GBE"
//   };
const firebaseConfig = {
    apiKey: "AIzaSyBVnu4pmsvbov_eVsY7_MNBcXyFjyPtv9k",
    authDomain: "otp-demo-f372d.firebaseapp.com",
    projectId: "otp-demo-f372d",
    storageBucket: "otp-demo-f372d.appspot.com",
    messagingSenderId: "136201502883",
    appId: "1:136201502883:web:84fbb34d50b5ef902bbf16",
    measurementId: "G-EGGHQBG2P7"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();