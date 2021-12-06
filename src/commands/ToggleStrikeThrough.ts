import { mdiFormatStrikethrough } from "@mdi/js";
import { Command } from "./Command";

export const ToggleStrikeThrough: Command = {
    exec: controller => controller.toggleStrike(),
    isActive: controller => controller.isStricken(),
    iconPath: mdiFormatStrikethrough,
};