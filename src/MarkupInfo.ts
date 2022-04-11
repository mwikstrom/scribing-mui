import { EmptyMarkup, Script } from "scribing";
import { FlowEditorController } from "scribing-react";

/** @public */
export interface MarkupInfo {
    tag: string | null;
    attr: ReadonlyMap<string, string | Script | null> | null;
    empty: boolean | null;
}

/** @public */
export interface MarkupUpdateInfo {
    tag?: string;
    attr?: ReadonlyMap<string, string | Script | null | UnsetAttribute>;
    empty?: boolean;
}

/** @public */
export function getMarkupInfo(controller: FlowEditorController | null | undefined): MarkupInfo | null {
    if (controller?.isMarkup()) {
        const tag = controller.getMarkupTag();
        const attr = controller.getMarkupAttrs();
        const empty = controller.isUniformNodes(node => node instanceof EmptyMarkup);
        return { tag, attr, empty };
    } else {
        return null;
    }
}

/** @public */
export const UnsetAttribute: unique symbol = Symbol();

/** @public */
export type UnsetAttribute = typeof UnsetAttribute;
