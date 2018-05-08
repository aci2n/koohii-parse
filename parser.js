function parse(dom) {
    const page = {};
    const $ = (selector, context = dom.window.document) => context.querySelector(selector);
    const $$ = (selector, context = dom.window.document) => Array.prototype.slice.call(context.querySelectorAll(selector));
    const $prop = (selector, context, property) => {
        const element = $(selector, context);
        return element ? element[property] : null;
    };
    const $text = (selector, context) => $prop(selector, context, "textContent");
    const $html = (selector, context) => $prop(selector, context, "innerHTML");

    function safeMatch(text, regexp) {
        const match = text && text.match(regexp);
        return match ? match[1] : null;
    }

    function parseStory(story) {
        return {
            author: coerce(
                $text(".sharedstory_author a", story),
                coerceNonEmptyString),
            lastModified: coerce(
                $text(".lastmodified", story),
                coerceDate),
            html: coerce(
                $html(".story", story),
                coerceNonEmptyString),
            favorites: coerce(
                $text(".JsStar span", story),
                coerceInt,
                0),
            reports: coerce(
                $text(".JsReport span", story),
                coerceInt,
                0)
        }
    }

    function coerce(value, coercer, fallback = null) {
        return coercer(value, fallback);
    }

    function coerceNonEmptyString(value, fallback) {
        return (typeof value === "string" && value !== "") ? value.trim() : fallback;
    }

    function coerceInt(value, fallback) {
        const int = parseInt(value);
        return isNaN(int) ? fallback : int;
    }

    function coerceDate(value, fallback) {
        let result = fallback;
        const tokens = value.split("-", 3).map(token => parseInt(token));
        if (tokens.length === 3 && tokens.every(Number.isFinite)) {
            result = new Date(tokens[2], tokens[1], tokens[0]).getTime();
        }
        return result;
    }

    page.kanji = coerce(
        $text(".kanji"),
        coerceNonEmptyString);

    page.frameNumber = coerce(
        $text(".framenum"),
        coerceInt);

    page.strokeCount = coerce(
        safeMatch($text(".strokecount"), /\[(\d+)/),
        coerceInt);

    page.onReading = coerce(
        safeMatch($text(".strokecount"), /\](.+)/),
        coerceNonEmptyString);

    page.keyword = coerce(
        $text(".JSEditKeyword"),
        coerceNonEmptyString);

    page.stories = {
        own: $("#sv-textarea .empty") ? null : coerce(
            $html("#sv-textarea"),
            coerceNonEmptyString),
        recent: $$("#sharedstories-new .sharedstory").map(parseStory),
        popular: $$("#sharedstories-fav .sharedstory").map(parseStory),
    }
    
    console.log(JSON.stringify(page, null, "  "));

    return page;
}

exports.parse = parse;