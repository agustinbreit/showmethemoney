import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';

const applicationServerPublicKey =  'BFLjFQFmq2Uav-PrnJmmEuqmKTZdyHnsPX6q3FTdzvzi5Rg8AMcVU-GGQBvehGqxQZmsm1PSuoUXFnHp2cAJl78';

import { FirebaseApp } from "angularfire2";
import * as firebase from 'firebase';
declare var Notification: any;

const config = {
  apiKey: "AIzaSyBK4aiONRnQoELokTSQvcDQA5vkxza_9CU",
  authDomain: "smtm-b6f56.firebaseapp.com",
  databaseURL: "https://smtm-b6f56.firebaseio.com",
  projectId: "smtm-b6f56",
  storageBucket: "smtm-b6f56.appspot.com",
  messagingSenderId: "43118194986"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
declare var idbKeyval;


@Component({
  selector: 'push-notifications',
  templateUrl: 'push-notifications.html'
})
export class PushNotificationsComponent implements OnInit {
  private isSubscribed = false;
  private registration = undefined;

  disablePushButton = false;
  pushButtonText = '';
  subscriptionJson = '';
  notificationsBoolean:boolean=false;
  firebaseToken:any;
  constructor(public storage:Storage) {
  
  }

  ngOnInit() {
    this.setupPush();
  }

  private setupPush() {
    if ('serviceWorker' in navigator && 'PushManager' in window && 'SyncManager' in window) {
      
      navigator.serviceWorker.register('/service-worker.js').then(reg => {
        this.registration = reg;
        try{
          this.registration.sync.register('gasto-pwa');
        }catch(e){
          console.log("error en la sincronizacion");
        }

       
        messaging.useServiceWorker(reg);
        this.initializeUI();
        
        //messaging.deleteToken(messaging.)
        this.notificationsBoolean=true;
      });
    } else {
      this.notificationsBoolean=false;
    }
  }

  subscribeClick() {
    this.disablePushButton = true;
    this.isSubscribed ? this.unsubscribeUser() : this.subscribeUser();
  }

  private initializeUI() {
    if(this.registration){
      this.registration.pushManager.getSubscription().then(subscription => {
        this.updateSubscriptionOnServer(subscription);
        
        this.updateBtn();
      });
    }
  }

  private unsubscribeUser() {
    this.registration.pushManager
      .getSubscription()
      .then(subscription => {
        if (subscription) {
          return subscription.unsubscribe();
        }
      })
      .catch(error => console.log('Error unsubscribing', error))
      .then(() => {
        this.updateSubscriptionOnServer(null);
        this.isSubscribed = false;
        this.updateBtn();
      });
  }

  private urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  subscribeUser() {
    const applicationServerKey = this.urlB64ToUint8Array(applicationServerPublicKey);
    this.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        //applicationServerKey: applicationServerKey
      })
      .then(subscription => {
        
        this.updateSubscriptionOnServer(subscription);
        this.isSubscribed = true;
        this.updateBtn();
      })
      .catch(err => {
        this.isSubscribed = false;
        this.updateBtn();
      });
  }

  private updateSubscriptionOnServer(subscription) {
    const url = 'https://smtm-server-side.herokuapp.com/api/smtm/updateSuscription';

    if(subscription){
      messaging.getToken()
      .then((currentToken)=> {
       this.firebaseToken=currentToken;
       let aux = JSON.stringify(subscription);
       let aux2 = JSON.parse(aux);
       let endpointAux = aux2.endpoint.split('/');
       endpointAux[endpointAux.length-1]=this.firebaseToken;
       aux2.endpoint=endpointAux.join('/');
       this.subscriptionJson = JSON.stringify(aux2);
       
       
       
       idbKeyval.get('uid').then((tokenId)=>{
         const fetchOptions = { method: 'POST', headers: { 'Content-Type': 'application/json','Accept':'application/json','Authorization':'Bearer '+tokenId,'Access-Control-Allow-Origin':'*' }, body: this.subscriptionJson };
         fetch(url, fetchOptions)
         .then(response=>response.json())
           .then((data) => {
             console.log('Push subscription request succeeded with JSON response', data);
             if(data){
               this.isSubscribed=data.isActive;
             }else{
               this.isSubscribed=false;
             }
 
             
           }
           )
           .catch(error => console.log('Push subscription request failed', error));
       })
       
      })
      .catch(function(err) {
        console.log('An error occurred while retrieving token. ', err);
      });
    }else{
      if(this.firebaseToken){
        messaging.deleteToken(this.firebaseToken).then((res)=>console.log(res)).catch((e)=>console.log(e));
      }
      this.subscriptionJson = JSON.stringify({isSubscribed:false});
      idbKeyval.get('uid').then((tokenId)=>{
        if(tokenId){
          const fetchOptions = { method: 'POST', headers: { 'Content-Type': 'application/json','Accept':'application/json','Authorization':'Bearer '+tokenId }, body: this.subscriptionJson };
          fetch(url, fetchOptions)
          .then(response=>response.json())
            .then((data) => {
              console.log('Push subscription request succeeded with JSON response', data);
              if(data){
                this.isSubscribed=data.isActive;
              }else{
                this.isSubscribed=false;
              }
            })
            .catch(error => console.log('Push subscription request failed', error));
        }
      })
      
     

    }

      
      
  }


  private updateBtn() {
    if (Notification.permission === 'denied') {
      this.pushButtonText = 'Push Messaging Blocked.';
      this.disablePushButton = true;
      this.updateSubscriptionOnServer(null);
      return;
    }
    this.disablePushButton = false;
  }



  notifications(){

  }



}