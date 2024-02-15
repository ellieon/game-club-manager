import { BaseInteraction } from "discord.js";

export type UserInteraction = BaseInteraction & {
    customId: string;
}