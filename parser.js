function parse($) {
    const page = {};
    const safeMatch = (text, regexp) => {
        const match = text && text.match(regexp);
        return match ? match[1] : null;
    }
    const coerce = (value, coercer, fallback = null) => coercer(value, fallback);
    const coerceNonEmptyString = (value, fallback) => {
        let result = fallback;

        if (typeof value === "string") {
            const trimmed = value.trim();

            if (trimmed !== "") {
                result = trimmed;
            }
        }

        return result;
    };
    const coerceInt = (value, fallback) => {
        const int = parseInt(value);
        return isNaN(int) ? fallback : int;
    };
    const coerceDate = (value, fallback) => {
        let result = fallback;
        const tokens = value.split("-", 3).map(token => parseInt(token));

        if (tokens.length === 3 && tokens.every(Number.isFinite)) {
            result = new Date(tokens[2], tokens[1], tokens[0]).getTime();
        }

        return result;
    };

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

    const parseStory = (index, story) => {
        const $story = $(story);

        return {
            author: coerce(
                $story.find(".sharedstory_author a").text(),
                coerceNonEmptyString),

            lastModified: coerce(
                $story.find(".lastmodified").text(),
                coerceDate),

            content: coerce(
                $story.find(".story").html(),
                coerceNonEmptyString),

            favorites: coerce(
                $story.find(".JsStar span").text(),
                coerceInt,
                0),

            reports: coerce(
                $story.find(".JsReport span").text(),
                coerceInt,
                0)
        }
    };

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