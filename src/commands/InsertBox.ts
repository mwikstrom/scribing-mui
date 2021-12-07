import { mdiTextBoxPlusOutline } from "@mdi/js";
import { BoxStyle } from "scribing";
import { Command } from "./Command";

export const InsertBox: Command = {
    exec: controller => controller.insertBox(BoxStyle.empty.set("variant", "outlined")),
    isDisabled: controller => controller.isTableSelection(),
    iconPath: mdiTextBoxPlusOutline,
};