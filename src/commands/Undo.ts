import { mdiUndo } from "@mdi/js";
import { Command } from "./Command";

export const Undo: Command = {
    exec: controller => controller.undo(),
    isDisabled: controller => !controller.canUndo(),
    iconPath: mdiUndo,
};