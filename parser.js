function parse(dom) {
    const page = {};
    const document = dom.window.document;

    function $(selector, element = document) {
        return element.querySelector(selector);
    }

    function $$(selector, element = document) {
        return Array.prototype.slice.call(element.querySelectorAll(selector));
    }

    function $text(selector, element) {
        return $(selector, element).textContent.trim();
    }

    function $html(selector, element) {
        return $(selector, element).innerHTML.trim();
    }

    function parseDate(date) {
        let result = null;

        if (date) {
            const tokens = date.split("-", 3).map(token => parseInt(token));

            if (tokens.length === 3 && tokens.every(Number.isFinite)) {
                result = new Date(tokens[2], tokens[1], tokens[0]).getTime();
            }
        }

        return result;
    }

    function parseStory(story) {
        return {
            author: $text(".sharedstory_author a", story),
            lastModified: parseDate($text(".lastmodified", story)),
            html: $html(".story", story),
            favorites: parseInt($text(".JsStar span", story)) || 0,
            reports: parseInt($text(".JsReport span", story)) || 0
        }
    }

    page.kanji = $text(".kanji");
    page.frameNumber = parseInt($text(".framenum"));
    page.strokeCount = parseInt($text(".strokecount").match(/\[(\d+)/)[1]);
    page.onReading = $text(".strokecount").match(/\](.+)/)[1];
    page.keyword = $text(".JSEditKeyword");
    page.stories = {
        own: $("#sv-textarea .empty") ? null : $html("#sv-textarea"),
        recent: $$("#sharedstories-new .sharedstory").map(parseStory),
        popular: $$("#sharedstories-fav .sharedstory").map(parseStory),
    }
    
    console.log(JSON.stringify(page, null, "  "));

    return page;
}

exports.parse = parse;