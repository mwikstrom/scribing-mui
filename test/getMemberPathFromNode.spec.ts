import { getMemberPathFromNode, parseScript, Slicer } from "../src/script/syntax";

describe("getMemberPathFromNode", () => {
    it("can find root variable", () => {
        const path = getMemberPathFromScript("MyVar");
        expect(path).toMatchObject(["MyVar"]);
    });

    it("can find root this", () => {
        const path = getMemberPathFromScript("this");
        expect(path).toMatchObject(["this"]);
    });

    it("can find root property", () => {
        const path = getMemberPathFromScript("MyVar.MyProp");
        expect(path).toMatchObject(["MyVar", "MyProp"]);
    });    

    it("can find this property", () => {
        const path = getMemberPathFromScript("this.MyProp");
        expect(path).toMatchObject(["this", "MyProp"]);
    });    

    it("can find nested property", () => {
        const path = getMemberPathFromScript("a.b.c");
        expect(path).toMatchObject(["a", "b", "c"]);
    });    

    it("can find deeply nested property", () => {
        const path = getMemberPathFromScript("a.b.c.d.e.f");
        expect(path).toMatchObject(["a", "b", "c", "d", "e", "f"]);
    });    

    it("can find deeply nested property from this", () => {
        const path = getMemberPathFromScript("this.a.b.c.d.e.f");
        expect(path).toMatchObject(["this", "a", "b", "c", "d", "e", "f"]);
    });    

    it("can find deeply nested property using brackets", () => {
        const path = getMemberPathFromScript("a['b\"\\\"x'][\"c'y\"].d.e[123]['f']");
        expect(path).toMatchObject(["a", "b\"\"x", "c'y", "d", "e", "123", "f"]);
    });    
});

const getMemberPathFromScript = (script: string): readonly string[] => {
    const node = parseScript(script).tree?.resolveInner(script.length, -1);
    const slice: Slicer = (from, to) => script.substring(from, to);
    return getMemberPathFromNode(node, slice);
};