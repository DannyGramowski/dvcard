import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as firebaseui from 'firebaseui';
import { FirebaseUIModule, firebase } from 'firebaseui-angular';
import environment from '../../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      scopes: [
        'public_profile',
        'email',
        'user_likes',
        'user_friends'
      ],
      customParameters: {
        'auth_type': 'reauthenticate'
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
  ], exports: [
    AngularFireModule,
    AngularFireAuthModule,
    FirebaseUIModule
  ]
})
export class FirebaseModule { }
