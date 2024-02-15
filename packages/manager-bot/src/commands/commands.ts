import { Command } from "./command";
import { HelloCommand } from "./helloCommand";
import { RandomGameSelectionCommand } from "./randomGameSelectionCommand";
import { ReccomendGameCommand,  } from "./reccomendGameCommand";

export const Commands: Command[] = [HelloCommand, ReccomendGameCommand];