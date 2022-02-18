import { mdiImageEdit, mdiImagePlus } from "@mdi/js";
import { fileOpen } from "browser-fs-access";
import { FlowImage } from "scribing";
import { createImageSource } from "scribing-react";
import { Command } from "./Command";

export const InsertImage: Command = {
    exec: async controller => {
        const blob = await fileOpen({mimeTypes: ["image/*"]});
        const uploadId = controller.uploadAsset(blob);
        const source = await createImageSource(blob, uploadId);

        if (controller.isImage()) {
            controller.setImageSource(source);
        } else {
            controller.insertNode(new FlowImage({ source, style: controller.getCaretStyle(), scale: 1 }));
        }
    },
    isDisabled: controller => !controller.isCaret() && !controller.isImage(),
    iconPath: controller => controller?.isImage() ? mdiImageEdit : mdiImagePlus,
};