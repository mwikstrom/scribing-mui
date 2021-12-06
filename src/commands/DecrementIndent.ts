import { mdiFormatIndentDecrease } from "@mdi/js";
import { Command } from "./Command";

export const DecrementIndent: Command = {
    exec: controller => controller.decrementListLevel(),
    isDisabled: controller => {
        const level = controller.getListLevel();
        return typeof level === "number" && level <= 0;
    },
    iconPath: mdiFormatIndentDecrease,
};