/* eslint-disable @typescript-eslint/no-var-requires */

import * as strings from 'ScwV2WebPartStrings';
const english = require("../loc/en-us.js")
const french = require("../loc/fr-fr.js")

export function SelectLanguage(lang: string): IScwV2WebPartStrings  {
    switch (lang) {
        case "en-us": {
            return english;
        }
        case "fr-fr": {
            return french;
        }
        default: {
            return strings;
        }
    }
}