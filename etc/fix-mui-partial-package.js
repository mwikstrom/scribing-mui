// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
[
    "styles",
    "Dialog",
].forEach(pkg => {
    const path = `./node_modules/@material-ui/core/${pkg}/package.json`;
    if (fs.existsSync(path)) {
        const parsed = JSON.parse(fs.readFileSync(path, "utf8"));
        if (!("name" in parsed)) {
            parsed.name = `@material-ui/core-${pkg}`;
            fs.writeFileSync(path, JSON.stringify(parsed));
            console.info("added fake \"name\" in:", path);
        }
    } else {
        console.warn("not found:", path);
    }    
});
