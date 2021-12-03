import React from "react";
import renderer from "react-test-renderer";
import { FlowEditorToolbar } from "../src";

describe("FlowEditorToolbar", () => {
    it("can render without props", () => {
        const component = renderer.create(<FlowEditorToolbar/>);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});