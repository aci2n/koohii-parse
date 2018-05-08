const fs = require("fs");
const program = require("commander");
const jsdom = require("jsdom");
const parser = require("./parser");

function initProgram() {
    program
        .version("0.1.0")
        .option("-i, --input [directory]", "pages directory", "../koohii-pages")
        .option("-o, --output [file]", "output json file", "../koohii.json")
        .option("-d --dry", "do not write output")
        .parse(process.argv);
}

function* readPages(directory) {
    for (let file of fs.readdirSync(directory)) {
        yield new jsdom.JSDOM(fs.readFileSync(`${directory}/${file}`, "utf8"));
    }
}

function writeOutput(file, data) {
    fs.writeFileSync(file, JSON.stringify(data));
    console.log(`saved output to ${file}`);
}

function main() {
    initProgram();

    try {
        const data = {
            pages: []
        };

        for (let page of readPages(program.input)) {
            data.pages.push(parser.parse(page));
        }

        if (!program.dry) {
            writeOutput(program.output, data);
        }
    } catch(error) {
        console.error(error);
    }
}

main();