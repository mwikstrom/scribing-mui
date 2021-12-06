import { mdiRedo } from "@mdi/js";
import { Command } from "./Command";

export const Redo: Command = {
    exec: controller => controller.redo(),
    isDisabled: controller => !controller.canRedo(),
    iconPath: mdiRedo,
};