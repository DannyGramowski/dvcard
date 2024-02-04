import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"dvcard-945d1","appId":"1:312122468231:web:f4c222cbac9845e44ed522","storageBucket":"dvcard-945d1.appspot.com","apiKey":"AIzaSyBYs8NSsFlN-kqSSoQjt5V25fXcVFeCVoU","authDomain":"dvcard-945d1.firebaseapp.com","messagingSenderId":"312122468231"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
