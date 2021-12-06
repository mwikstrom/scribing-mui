import { mdiFormatListBulleted } from "@mdi/js";
import { Command } from "./Command";

export const ToggleUnorderedList: Command = {
    exec: controller => controller.toggleUnorderedList(),
    isActive: controller => controller.isUnorderedList(),
    iconPath: mdiFormatListBulleted,
    flipIcon: controller => controller.isTextDirection("rtl"),
};