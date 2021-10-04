import Web3 from "web3";

// main interface of the schema class defining a supported notification type in a project
export abstract class Notification {
  // mandatory short name (2-4 words) of the notification type, eg. "Low Health Factor"
  static displayName: string;
  // mandatory one sentence description of what's being monitored
  static description: string;
  // optional name of a display icon for this notification type
  static displayIcon: DisplayIcon;

  // runs once when this class is initialized
  abstract onInit(args: OnInitArgs): Promise<void>;
  // runs before the user is presented the subscribe form when subscribing to a new notification
  abstract onSubscribeForm(args: OnSubscribeFormArgs): Promise<SubscribeFormField | SubscribeFormField[]>;
  // runs on consecutive block ranges and returns an array of push notifications to send the user
  abstract onBlocks(args: OnBlocksArgs): Promise<PushNotification | PushNotification[]>;
}

// display icons, see https://example.com/icons to see all available
export type DisplayIcon = "hand" | "wallet" | "up-arrow" | "down-arrow"; // TODO: add more

// network the project is running on
export type Network = "ethereum" | "bsc" | "polygon"; // TODO: add more

// arguments for onInit()
export interface OnInitArgs {
  // initialized web3 instance
  web3: Web3;
  // network the project is running on
  network: Network;
}

// arguments for onSubscribeForm()
export interface OnSubscribeFormArgs {
  // initialized web3 instance
  web3: Web3;
  // network the project is running on
  network: Network;
  // string address of the subscribing user wallet starting with "0x"
  address: string;
}

// arguments for onBlocks()
export interface OnBlocksArgs {
  // initialized web3 instance
  web3: Web3;
  // network the project is running on
  network: Network;
  // string address of the subscribing user wallet starting with "0x"
  address: string;
  // the first block in the range to be scanned for potential notifications
  fromBlock: number;
  // the last block in the range to be scanned for potential notifications
  toBlock: number;
  // key-value of the onBeforeSubscribe params the user chose when subscribing (id -> value)
  subscription: SubscriptionValues;
}

// key-value of the onBeforeSubscribe params the user chose when subscribing (id -> value)
export type SubscriptionValues = { [label: string]: string };

// field in the form presented to the user when subscribing to a new notification
export interface SubscribeFormField {
  // the type of the field in the form, eg. "input-number" is a numerical input field
  type: FormFieldType;
  // label of the field as displayed to the user (can be changed over time)
  label: string;
  // optional one sentence description explaining this field to the user
  description?: string;
  // optional default value for the field
  default?: any;
  // required for "input-select" fields and contains all the available options for selection
  values?: LabelAndValue[];
  // required for "hidden" and contains the value of the field
  value?: any;
  // internal ID of the field when storing the subscription persistently (cannot change over time), see SubscriptionValues 
  id: string;
}

// the type of the field in the form, eg. "input-number" is a numerical input field
export type FormFieldType = "input-number" | "input-select" | "hidden";

// a pair of a value and its label for users for selection options
export interface LabelAndValue {
  // the display label for the user
  label: string;
  // the value to be passed to the subscription params
  value: string;
}

// push notification to be sent to a subscribed user
export interface PushNotification {
  // short sentence with the text content of the notification pushed to the user
  notification: string;
  // optional link to visit when the user wants to act on the push notification
  link?: string;
  // optional unique ID for this notification to prevent sending duplicate notifications to users about the same event
  uniqueId?: string;
}
