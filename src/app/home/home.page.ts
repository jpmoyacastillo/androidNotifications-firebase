import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    LocalNotifications.schedule({
      notifications: [
        {
          title: 'notificación local',
          body: 'notification.body',
          id: 1,
        },
      ],
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    // En primer plano
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log(
          'Push received en 1er plano: ' + JSON.stringify(notification)
        );

        LocalNotifications.schedule({
          notifications: [
            {
              title: 'notificación local',
              body: notification.body,
              id: 1,
              extra: {
                data: notification.data,
              },
            },
          ],
        });
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log(
          'Push action performed en segundo plano: ' +
            JSON.stringify(notification)
        );
        this.router.navigate(['/alerts']);
      }
    );

    // Method called when click on a local notification
    LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notification) => {
        console.log(
          'Push action performed en segundo plano: ' +
            JSON.stringify(notification)
        );
        this.router.navigate(['/alerts']);
      }
    );
  }
}
