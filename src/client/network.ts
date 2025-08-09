import { GlobalEvents, GlobalFunctions } from "shared/network";

/**
 * Client-side network events and functions
 * Used to communicate with the server
 */
export const Events = GlobalEvents.createClient({});
export const Functions = GlobalFunctions.createClient({});
