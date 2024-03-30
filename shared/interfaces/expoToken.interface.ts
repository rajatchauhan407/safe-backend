export interface IExpoToken {
    token: string; // the Expo token
    userId: string; // the ID of the user
    timestamp: Date; // the date and time when the token was generated
    platform: 'ios' | 'android'; // the platform of the device
  }