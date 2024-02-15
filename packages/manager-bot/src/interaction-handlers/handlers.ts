import { Handler } from "./interactionHandler";
import { ReccomendationFormSubmitHandler } from "./reccomendationFormSubmitHandler";

export const Handlers: Handler[] = [ new ReccomendationFormSubmitHandler() ];