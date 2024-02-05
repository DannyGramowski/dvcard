import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import {FirebaseUIModule} from 'firebaseui-angular';
import 'firebaseui/dist/firebaseui.css'
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import environment from '../environments/environment';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule, USE_EMULATOR as USE_AUTH_EMULATOR} from "@angular/fire/compat/auth";
import { AppComponent } from './app.component';
import { FirebaseModule } from './firebase/firebase.module';



@NgModule({
    declarations: [
    ],
    imports: [
        AppComponent,
        BrowserModule,
        FirebaseModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}