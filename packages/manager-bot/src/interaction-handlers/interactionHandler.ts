import { ModalSubmitInteraction, ModalSubmitInteractionCollectorOptions, Client } from "discord.js";
import { UserInteraction } from "../event-listeners/interactionCreate";

export interface Handler {
    run: (client: Client, interaction: UserInteraction) => void;
    name: string;
}