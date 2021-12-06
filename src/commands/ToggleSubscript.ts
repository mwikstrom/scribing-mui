import { mdiFormatSubscript } from "@mdi/js";
import { Command } from "./Command";

export const ToggleSubscript: Command = {
    exec: controller => controller.toggleSubscript(),
    isActive: controller => controller.isSubscript(),
    iconPath: mdiFormatSubscript,
};