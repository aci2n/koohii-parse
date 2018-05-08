const fs = require("fs");
const program = require("commander");
const cheerio = require("cheerio");
const parser = require("./parser");

function initProgram() {
    program
        .version("0.1.0")
        .option("-i, --input [directory]", "pages directory", "../koohii-pages")
        .option("-o, --output [file]", "output json file", "../koohii.json")
        .option("-d --dry", "do not write output")
        .parse(process.argv);
}

function* parsePages(directory) {
    for (let file of fs.readdirSync(directory)) {
        yield parser.parse(cheerio.load(fs.readFileSync(`${directory}/${file}`, "utf8")));
    }
}

function writeOutput(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, "  "));
    console.log(`saved output to ${file}`);
}

function main() {
    initProgram();

    try {
        const data = {};

        for (let page of parsePages(program.input)) {
            if (page.kanji) {
                data[page.kanji] = page;
                console.log(`parsed page for ${page.kanji}`);
            } else {
                console.warn("invalid parse result", page);
            }
        }

        if (!program.dry) {
            writeOutput(program.output, data);
        }
    } catch(error) {
        console.error(error);
    }
}

main();