import { Observable , of} from 'rxjs';
import { User } from './user.model';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { EventEmitter } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  invalidEmail = new Error('Not valid email');
  public isLoggedIn = new Subject<boolean>();

  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
   }

   private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoURL,

    };
    return userRef.set(data, { merge: true});

  }

  private updateUserData1(user, value) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: value.displayName,
      photoUrl: user.photoURL,
      password: value.password
    };
    return userRef.set(data, { merge: true});

  }

  async googleSignin() {
    try {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    this.isLoggedIn.next(true);
    return this.updateUserData(credential.user);
    } catch (error) {
      alert(error.message);

    }}

  async facebookSignin() {
    try {
    const provider = new auth.FacebookAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    this.isLoggedIn.next(true);
    return this.updateUserData(credential.user);
    } catch (error) {
      alert(error.message);
    }
    }


  async emailSignin(value) {
    try {
      const credential = await auth().signInWithEmailAndPassword(value.email, value.password);
      this.isLoggedIn.next(true);
      return this.updateUserData1(credential.user, value);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if ( errorCode === 'auth/wrong-password') {
        alert('The wrong password. Did you sign up with Social Media??');
       } else if ( errorCode === 'auth/user-not-found') {
        alert(errorMessage);
        this.router.navigate(['/register']);
       } else if (errorCode === 'auth/invalid-email') {
         alert(errorCode);

      } else {
         alert(errorCode);
      }
      throw new Error();

    }
  }

  async emailSignUp(value) {
    try {

      const credential = await auth().createUserWithEmailAndPassword(value.email, value.password);
      if (!credential.user.emailVerified) {
        throw this.invalidEmail;
      }
      this.isLoggedIn.next(true);
      return this.updateUserData1(credential.user, value);

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
          alert(errorMessage);
        } else if (errorCode === 'auth/email-already-in-use') {
          alert(errorMessage);
          this.router.navigate(['/login']);
        } else {
          alert(errorMessage);
        }
    }
  }


  async signOut() {
    await this.afAuth.auth.signOut();
    this.isLoggedIn.next(false);
    return (this.router.navigate(['/']));
  }


}


