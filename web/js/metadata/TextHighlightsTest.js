var assert = require('assert');

const {TextHighlight} = require("./TextHighlight");
const {TextHighlights} = require("./TextHighlights");
const {assertJSON} = require("../test/Assertions");
const tk = require('timekeeper');

// freeze time for testing...
const time = new Date(1330688329321);
tk.freeze(time);

describe('TextHighlights', function() {

    describe('create', function() {

        it("basic", function () {

            let rects = [ {top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}];
            let textSelections = ["hello world"];
            let text = "hello world";

            // create a basic TextHighlight object..
            let textHighlightRecord = TextHighlights.create(rects, textSelections, text);

            let expected = {
                "id": "12pNUv1Y9S3RjFsgcRBrQuba849iB3xecQLb9tmKv4Ve5mG412j",
                "value": {
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "rects": {
                        "0": {
                            "top": 100,
                            "left": 100,
                            "right": 200,
                            "bottom": 200,
                            "width": 100,
                            "height": 100
                        }
                    },
                    "textSelections": {
                        "0": "hello world"
                    },
                    "text": "hello world",
                    "thumbnail": null
                }
            };

            assertJSON(textHighlightRecord, expected)

        });

    });

});
