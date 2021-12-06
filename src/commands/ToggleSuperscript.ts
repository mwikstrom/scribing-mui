import { mdiFormatSuperscript } from "@mdi/js";
import { Command } from "./Command";

export const ToggleSuperscript: Command = {
    exec: controller => controller.toggleSuperscript(),
    isActive: controller => controller.isSuperscript(),
    iconPath: mdiFormatSuperscript,
};