function safeMatch(text, regexp) {
    const match = text && text.match(regexp);
    return match ? match[1] : null;
}

function coerce(value, coercer, fallback = null) {
    return coercer(value, fallback);
}

function coerceNonEmptyString(value, fallback) {
    let result = fallback;

    if (typeof value === "string") {
        const trimmed = value.trim();

        if (trimmed !== "") {
            result = trimmed;
        }
    }

    return result;
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

function parse($) {
    const page = {};
    
    function parseStory(index, story) {
        return coerce(
            $(story).find(".story").html(),
            coerceNonEmptyString);
    }

    page.kanji = coerce(
        $(".kanji").text(),
        coerceNonEmptyString);

    page.frameNumber = coerce(
        $(".framenum").text(),
        coerceInt);

    page.strokeCount = coerce(
        safeMatch($(".strokecount").text(), /\[(\d+)/),
        coerceInt);

    page.onReading = coerce(
        safeMatch($(".strokecount").text(), /\](.+)/),
        coerceNonEmptyString);

    page.keyword = coerce(
        $(".JSEditKeyword").text(),
        coerceNonEmptyString);


    page.stories = {
        own: $("#sv-textarea .empty").length > 0 ? null : coerce(
            $("#sv-textarea").html(),
            coerceNonEmptyString),
        recent: $("#sharedstories-new .sharedstory").map(parseStory).toArray(),
        popular: $("#sharedstories-fav .sharedstory").map(parseStory).toArray(),
    }

    return page;
}

exports.parse = parse;