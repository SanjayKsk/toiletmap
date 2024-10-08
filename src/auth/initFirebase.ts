import firebase from "firebase/app";
import "firebase/auth";

const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

export default function initFirebase() {
    //initialize if app is not currently initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
}
