import { mdiFormatListNumbered, mdiFormatListNumberedRtl } from "@mdi/js";
import { Command } from "./Command";

export const ToggleOrderedList: Command = {
    exec: controller => controller.toggleOrderedList(),
    isActive: controller => controller.isOrderedList(),
    iconPath: controller => controller?.isTextDirection("rtl") ? mdiFormatListNumberedRtl : mdiFormatListNumbered,
};