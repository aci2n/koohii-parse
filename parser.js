function parse(dom) {
    const page = {};

    console.log(dom);
    
    page.navigation = {
        prev: dom.querySelector(".study-search_btn.is-prev")
    }

    return {};
}

exports.parse = parse;