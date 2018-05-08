const fs = require("fs");
const program = require("commander");
const jsdom = require("jsdom");

function initProgram() {
    program
        .version("0.1.0")
        .option("-i, --input [directory]", "pages directory", "../koohii-pages")
        .option("-o, --output [file]", "output json file", "../koohii.json")
        .parse(process.argv);
}

function* readPages(directory) {
    for (let file of fs.readdirSync(directory)) {
        yield fs.readFileSync(`${directory}/${file}`, "utf8");
    }
}

function writeOutput(file, data) {
    fs.writeFileSync(file, JSON.stringify(data));
    console.log(`saved output to ${file}`);
}

function parsePage(page) {
    const dom = new jsdom.JSDOM(page);
    return {};
}

function main() {
    initProgram();

    try {
        const data = {
            pages: []
        };

        for (let page of readPages(program.input)) {
            data.pages.push(parsePage(page));
        }

        writeOutput(program.output, data);
    } catch(error) {
        console.error(error);
    }
}

main();