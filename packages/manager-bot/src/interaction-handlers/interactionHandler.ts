import { Client } from "discord.js";
import { UserInteraction } from "../types/userInteraction";

export interface Handler {
    run: (client: Client, interaction: UserInteraction) => void;
    name: string;
}