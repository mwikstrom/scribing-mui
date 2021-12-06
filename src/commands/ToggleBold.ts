import { mdiFormatBold } from "@mdi/js";
import { Command } from "./Command";

export const ToggleBold: Command = {
    exec: controller => controller.toggleBold(),
    isActive: controller => controller.isBold(),
    iconPath: mdiFormatBold,
};