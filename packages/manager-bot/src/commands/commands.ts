import { Command } from "./command";
import { RandomGameSelectionCommand } from "./randomGameSelectionCommand";
import { ReccomendGameCommand,  } from "./reccomendGameCommand";

export const Commands: Command[] = [new ReccomendGameCommand(), new RandomGameSelectionCommand()];