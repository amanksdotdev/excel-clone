"use strict";

let workSheetDB = {
    title: "Untitled Spreadsheet",
    sheets: [],
};

const initSheetDB = function () {
    const sheetDB = [];
    for (let i = 0; i < 100; i++) {
        const row = [];
        for (let j = 0; j < 26; j++) {
            const cell = {
                bold: false,
                italic: false,
                underline: false,
                strikethrough: false,
                fontFamily: "arial",
                fontSize: "16",
                color: "",
                formula: "",
                children: [],
                alignment: "left",
                value: "",
            };
            row.push(cell);
        }
        sheetDB.push(row);
    }
    workSheetDB.sheets.push(sheetDB);
};

initSheetDB();
