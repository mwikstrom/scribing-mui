import {  parseScript, Slicer } from "../src/script/syntax";
import { getTypeSelectionPathFromNode, selectMember, TypeSelection } from "../src/script/path";

describe("getTypeSelectionPathFromNode", () => {
    it("can find root variable", () => {
        const path = getMemberPathFromScript("MyVar");
        expect(path).toMatchObject(["MyVar"].map(selectMember));
    });

    it("can find root this", () => {
        const path = getMemberPathFromScript("this");
        expect(path).toMatchObject(["this"].map(selectMember));
    });

    it("can find root property", () => {
        const path = getMemberPathFromScript("MyVar.MyProp");
        expect(path).toMatchObject(["MyVar", "MyProp"].map(selectMember));
    });    

    it("can find this property", () => {
        const path = getMemberPathFromScript("this.MyProp");
        expect(path).toMatchObject(["this", "MyProp"].map(selectMember));
    });    

    it("can find nested property", () => {
        const path = getMemberPathFromScript("a.b.c");
        expect(path).toMatchObject(["a", "b", "c"].map(selectMember));
    });    

    it("can find deeply nested property", () => {
        const path = getMemberPathFromScript("a.b.c.d.e.f");
        expect(path).toMatchObject(["a", "b", "c", "d", "e", "f"].map(selectMember));
    });    

    it("can find deeply nested property from this", () => {
        const path = getMemberPathFromScript("this.a.b.c.d.e.f");
        expect(path).toMatchObject(["this", "a", "b", "c", "d", "e", "f"].map(selectMember));
    });    

    it("can find deeply nested property using brackets", () => {
        const path = getMemberPathFromScript("a['b\"\\\"x'][\"c'y\"].d.e[123]['f']");
        expect(path).toMatchObject(["a", "b\"\"x", "c'y", "d", "e", "123", "f"].map(selectMember));
    });    
});

const getMemberPathFromScript = (script: string): readonly TypeSelection[] | null => {
    const node = parseScript(script).tree?.resolveInner(script.length, -1);
    const slice: Slicer = (from, to) => script.substring(from, to);
    return getTypeSelectionPathFromNode(node, slice);
};