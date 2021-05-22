"use strict";

//INITIALIZING sheetDB
let sheetDB = workSheetDB.sheets[0];

//FUNCTIONS
const handleCellHeight = function (cell) {
    const cellHeight = cell.getBoundingClientRect().height;
    let rid = cell.getAttribute("rid");
    const leftBox = document.querySelectorAll(".grid__left-col-box")[rid];
    const leftBoxHeight = leftBox.getBoundingClientRect().height;

    if (cellHeight != leftBoxHeight) {
        leftBox.style.height = cellHeight + "px";
    }
};

const updateAddressBox = function (cell) {
    let rid = Number.parseInt(cell.getAttribute("rid"));
    let cid = Number.parseInt(cell.getAttribute("cid"));
    let cellAddress = `${String.fromCharCode(cid + 65)}${rid + 1}`;
    formula_addressBox.value = cellAddress;
};

const getCurrentCellRidCid = function () {
    let cellId = formula_addressBox.value;
    let [cid, rid] = cellId.split(/(\d+)/); // split string with number
    cid = cid.charCodeAt(0) - 65; // convert char to num
    rid--; // reduce rid to match idx
    return [rid, cid];
};

const getCurrentCell = function () {
    let [rid, cid] = getCurrentCellRidCid();
    return document.querySelector(`.grid__col[rid="${rid}"][cid="${cid}"]`);
};

const updateUI = function () {
    const allCells = document.querySelectorAll(
        ".grid__cells-container .grid__col"
    );

    for (const cell of allCells) {
        //handle cell height due to active cell border
        // handleCellHeight(cell);

        //update ui according to cell data
        const [rid, cid] = [cell.getAttribute("rid"), cell.getAttribute("cid")];
        const cellObj = sheetDB[rid][cid];

        //bold btn update
        if (cellObj.bold) {
            menu_boldBtn.classList.add("menu-btn--active");
            cell.style.fontWeight = "bold";
        } else {
            menu_boldBtn.classList.remove("menu-btn--active");
            cell.style.fontWeight = "normal";
        }

        //underline btn update
        if (cellObj.underline) {
            menu_underlineBtn.classList.add("menu-btn--active");
            cell.style.textDecoration = "underline";
        } else {
            menu_underlineBtn.classList.remove("menu-btn--active");
            cell.style.textDecoration = "none";
        }

        //italic btn update
        if (cellObj.italic) {
            menu_italicBtn.classList.add("menu-btn--active");
            cell.style.fontStyle = "italic";
        } else {
            menu_italicBtn.classList.remove("menu-btn--active");
            cell.style.fontStyle = "normal";
        }

        //strikethrough btn update
        if (cellObj.strikethrough) {
            menu_strikethroughBtn.classList.add("menu-btn--active");
            cell.style.textDecoration = "line-through";
        } else {
            menu_strikethroughBtn.classList.remove("menu-btn--active");
            cell.style.textDecoration = "none";
        }

        // alignment btn update
        switch (cellObj.alignment) {
            case "left":
                handleAlignment("left", menu_leftAlignBtn, cell);
                break;
            case "center":
                handleAlignment("center", menu_centerAlignBtn, cell);
                break;
            case "right":
                handleAlignment("right", menu_rightAlignBtn, cell);
                break;
        }

        //color picker update
        if (cellObj.color != "") {
            menu_colorPickerDiv.style.backgroundColor = cellObj.color;
            cell.style.color = cellObj.color;
        } else {
            menu_colorPickerDiv.style.backgroundColor = "black";
            cell.style.color = "black";
        }

        //font selector update
        menu_fontFamily.value = cellObj.fontFamily;
        cell.style.fontFamily = cellObj.fontFamily;

        //font size update
        menu_fontSize.value = cellObj.fontSize;
        cell.style.fontSize = cellObj.fontSize + "px";

        //value update
        cell.innerText = cellObj.value;
    }

    allCells[0].click();
};

const addNewSheetToSheetList = function () {
    const allSheets = document.querySelectorAll(".sheets__sheet");

    //get last sheet idx
    const idx = allSheets.length;

    // create new sheet element
    const newSheet = document.createElement("div");

    //add necessary and active class
    newSheet.classList.add("sheets__sheet", "sheets__sheet--active");
    newSheet.setAttribute("sheetIdx", idx);
    newSheet.innerText = `Sheet ${idx + 1}`;

    //add event listner to new sheet
    newSheet.addEventListener("click", handleSheetChange);

    //remove active from every sheet
    allSheets.forEach((sheet) => {
        sheet.classList.remove("sheets__sheet--active");
    });

    //add new sheet to sheet lists
    sheets_list.appendChild(newSheet);

    //initialize new sheet db
    initSheetDB();
    sheetDB = workSheetDB.sheets[idx];
    updateUI();
};

const handleSheetChange = function (e) {
    //if already active sheet then return
    if (e.target.classList.contains("sheets__sheet--active")) {
        return;
    }

    //else change sheet
    const allSheets = document.querySelectorAll(".sheets__sheet");
    allSheets.forEach((sheet) => {
        sheet.classList.remove("sheets__sheet--active");
    });
    e.target.classList.add("sheets__sheet--active");

    const sheetIdx = e.target.getAttribute("sheetIdx");
    sheetDB = workSheetDB.sheets[sheetIdx];
    updateUI();
};

const handleGridScroll = function (e) {
    const top = e.target.scrollTop;
    const left = e.target.scrollLeft;
    grid_topLeftBlock.style.top = top + "px";
    grid_topLeftBlock.style.left = left + "px";
    grid_topRow.style.top = top + "px";
    grid_leftCol.style.left = left + "px";
};

const handleBold = function () {
    //update active class
    menu_boldBtn.classList.toggle("menu-btn--active");

    //update ui and database
    const cell = getCurrentCell();
    const [rid, cid] = getCurrentCellRidCid();
    if (menu_boldBtn.classList.contains("menu-btn--active")) {
        cell.style.fontWeight = "bold";
        sheetDB[rid][cid].bold = true;
    } else {
        cell.style.fontWeight = "normal";
        sheetDB[rid][cid].bold = false;
    }
};

const handleUnderline = function () {
    //update active class
    menu_underlineBtn.classList.toggle("menu-btn--active");

    //update ui and db
    const cell = getCurrentCell();
    const [rid, cid] = getCurrentCellRidCid();
    if (menu_underlineBtn.classList.contains("menu-btn--active")) {
        cell.style.textDecoration = "underline";
        sheetDB[rid][cid].underline = true;
        //remove strikethrough text-decoration
        menu_strikethroughBtn.classList.remove("menu-btn--active");
        sheetDB[rid][cid].strikethrough = false;
    } else if (!menu_strikethroughBtn.classList.contains("menu-btn--active")) {
        cell.style.textDecoration = "none";
        sheetDB[rid][cid].underline = false;
    }
};

const handleItalic = function () {
    //update active class
    menu_italicBtn.classList.toggle("menu-btn--active");

    //update ui and db
    const cell = getCurrentCell();
    const [rid, cid] = getCurrentCellRidCid();
    if (menu_italicBtn.classList.contains("menu-btn--active")) {
        cell.style.fontStyle = "italic";
        sheetDB[rid][cid].italic = true;
    } else {
        cell.style.fontStyle = "normal";
        sheetDB[rid][cid].italic = false;
    }
};

const handleStrikethrough = function () {
    //update active class
    menu_strikethroughBtn.classList.toggle("menu-btn--active");

    //update ui and db
    const cell = getCurrentCell();
    const [rid, cid] = getCurrentCellRidCid();
    if (menu_strikethroughBtn.classList.contains("menu-btn--active")) {
        cell.style.textDecoration = "line-through";
        sheetDB[rid][cid].strikethrough = true;
        //removing underline
        menu_underlineBtn.classList.remove("menu-btn--active");
        sheetDB[rid][cid].underline = false;
    } else if (!menu_underlineBtn.classList.contains("menu-btn--active")) {
        cell.style.textDecoration = "none";
        sheetDB[rid][cid].strikethrough = false;
    }
};

const handleFontColor = function (color) {
    //update ui
    const cell = getCurrentCell();
    cell.style.color = color;

    //update database
    const [rid, cid] = getCurrentCellRidCid();
    sheetDB[rid][cid].color = color;
};

const handleAlignment = function (alignment, btnEl, cell) {
    //reset active class
    menu_leftAlignBtn.classList.remove("menu-btn--active");
    menu_rightAlignBtn.classList.remove("menu-btn--active");
    menu_centerAlignBtn.classList.remove("menu-btn--active");

    //update ui
    btnEl.classList.add("menu-btn--active");
    cell.style.textAlign = alignment;

    //update database
    const [rid, cid] = [cell.getAttribute("rid"), cell.getAttribute("cid")];
    sheetDB[rid][cid].alignment = alignment;
};

/*********************FORMULA Functions*****************/

const getCell = function (id) {
    let [cid, rid] = id.split(/(\d+)/); // split string with number
    cid = cid.charCodeAt(0) - 65; // convert char to num
    rid--; // reduce rid to match idx

    return document.querySelector(`.grid__col[rid="${rid}"][cid="${cid}"]`);
};

const getFormula = function (formula) {
    const formulaArr = formula.split(" ");
    for (let i = 0; i < formulaArr.length; i++) {
        let ascii = formulaArr[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let parentCellId = formulaArr[i];
            let pcell = getCell(parentCellId);
            formulaArr[i] = pcell.innerText;
        }
    }

    return formulaArr.join(" ");
};

const evaluateFormula = function (formula) {
    const operands = [];
    const operators = [];

    const exp = formula.split(" ");
    for (let i = 0; i < exp.length; i++) {
        let ch = exp[i];

        if (ch == "(") {
            operators.push(ch);
        } else if (isFinite(ch)) {
            operands.push(Number.parseFloat(ch));
        } else if (ch == "+" || ch == "-" || ch == "*" || ch == "/") {
            while (
                operators.length > 0 &&
                operators[operators.length - 1] != "(" &&
                precedence(ch) <= precedence(operators[operators.length - 1])
            ) {
                const val2 = operands.pop();
                const val1 = operands.pop();
                const optr = operators.pop();

                const finalVal = operation(val1, val2, optr);
                console.log(finalVal);
                operands.push(finalVal);
            }
            operators.push(ch);
        } else if (ch == ")") {
            while (
                operators.length > 0 &&
                operators[operators.length - 1] != "("
            ) {
                const val2 = operands.pop();
                const val1 = operands.pop();
                const optr = operators.pop();

                const finalVal = operation(val1, val2, optr);
                operands.push(finalVal);
            }

            if (operators.length > 0) {
                operators.pop();
            }
        }
    }

    while (operators.length > 0) {
        const val2 = operands.pop();
        const val1 = operands.pop();
        const optr = operators.pop();

        const finalVal = operation(val1, val2, optr);
        console.log(finalVal);
        operands.push(finalVal);
    }

    return operands.pop();
};

const precedence = function (optr) {
    switch (optr) {
        case "+":
        case "-":
            return 1;
        case "*":
        case "/":
            return 2;
    }
};

const operation = function (val1, val2, optr) {
    switch (optr) {
        case "+":
            return val1 + val2;
        case "-":
            return val1 - val2;
        case "*":
            return val1 * val2;
        case "/":
            return val1 / val2;
    }
};

// set child of parents found in formula
const setChild = function (formula, childID) {
    const formulaArr = formula.split(" ");

    for (let i = 0; i < formulaArr.length; i++) {
        let ascii = formulaArr[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let parentCellID = formulaArr[i];
            let pcell = getCell(parentCellID);
            let rid = pcell.getAttribute("rid");
            let cid = pcell.getAttribute("cid");

            sheetDB[rid][cid].children.push(childID);
        }
    }
};

//recusive function to update children if parent data is changed
const updateChildrenData = function (parentObj) {
    const children = parentObj.children;
    for (let childID of children) {
        //extract child cell and obj from childID
        const childCell = getCell(childID);
        const rid = childCell.getAttribute("rid");
        const cid = childCell.getAttribute("cid");
        const childCellObj = sheetDB[rid][cid];

        // extract formula of child and evaluate
        const formula = childCellObj.formula;
        const actualFormula = getFormula(formula);
        const value = evaluateFormula(actualFormula);

        //update ui
        childCell.innerText = value;

        //update db
        childCellObj.value = value;

        //recusively call updateChildren on current child's children
        updateChildrenData(childCellObj);
    }
};

// correctly remove formula with removing cell from it's parent children
const removeFormula = function (formula, cellID, cellObj) {
    let formulaArr = formula.split(" ");

    for (let i = 0; i < formulaArr.length; i++) {
        let ascii = formulaArr[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            //extract parent cell and obj
            let parentCellId = formulaArr[i];
            let pcell = getCell(parentCellId);
            let rid = pcell.getAttribute("rid");
            let cid = pcell.getAttribute("cid");
            let parenCellObj = sheetDB[rid][cid];

            //get idx of child cell-id from parent's obj children
            let idx = parenCellObj.children.indexOf(cellID);

            //remove child
            parenCellObj.children.splice(idx, 1);
        }
    }

    //remove formula from child obj
    cellObj.formula = "";
};

/**************MENU SECTION**********/
// title handler
menu_title.addEventListener("click", () => {
    menu_titleInput.select();
});

menu_titleInput.addEventListener("keyup", () => {
    const title = menu_titleInput.value;
    workSheetDB.title = title;
});

const resetSheetsUI = function () {
    //removing all sheets except 1
    const allSheets = document.querySelectorAll(".sheets__sheet");
    for (let i = allSheets.length - 1; i >= 1; i--) {
        allSheets[i].remove();
    }
    //removing active class so that click event works and resets UI
    allSheets[0].classList.remove("sheets__sheet--active");
    //clicking first sheet to update UI
    allSheets[0].click();
};
const fileInputEl = document.querySelector(".file-input");
//new
menu_new.addEventListener("click", () => {
    //reset workseetDB
    workSheetDB = {
        title: "Untitled Spreadsheet",
        sheets: [],
    };
    //init sheet DB
    initSheetDB();
    //reset open file input so that change event will work if we open the same file after making a new sheet
    fileInputEl.value = "";

    menu_titleInput.value = workSheetDB.title;

    //reseting sheets ui
    resetSheetsUI();
});

//save btn
menu_save.addEventListener("click", () => {
    const a = document.createElement("a");

    const url =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(workSheetDB));

    a.setAttribute("href", url);
    a.setAttribute("download", `${workSheetDB.title}.json`);
    a.click();
});

//open

menu_open.addEventListener("click", () => {
    fileInputEl.click();

    fileInputEl.addEventListener("change", () => {
        const filesArr = fileInputEl.files;
        const fileObj = filesArr[0];
        // console.log(fileObj);
        //file reader API
        const fr = new FileReader();
        fr.readAsText(fileObj);
        fr.addEventListener("load", () => {
            const stringData = fr.result;
            workSheetDB = JSON.parse(stringData);
            sheetDB = workSheetDB.sheets[0];
            menu_titleInput.value = workSheetDB.title;
            updateUI();
            resetSheetsUI();
            //add sheet according to worksheetDB
            for (let i = 0; i < workSheetDB.sheets.length - 1; i++) {
                const allSheets = document.querySelectorAll(".sheets__sheet");

                //get last sheet idx
                const idx = allSheets.length;

                // create new sheet element
                const newSheet = document.createElement("div");

                //add class and sheetidx
                newSheet.classList.add("sheets__sheet");
                newSheet.setAttribute("sheetIdx", idx);
                newSheet.innerText = `Sheet ${idx + 1}`;

                //add event listner to new sheet
                newSheet.addEventListener("click", handleSheetChange);

                //add new sheet to sheet lists
                sheets_list.appendChild(newSheet);
            }
        });
    });
});

// handling colorpicker
menu_colorPickerBtn.addEventListener("mouseover", (e) => {
    menu_colorPickerBtn.classList.add("hidden");
    menu_colorPicker.classList.remove("hidden");
});

menu_colorPicker.addEventListener("change", (e) => {
    let color = menu_colorPicker.value;
    menu_colorPickerBtn.classList.remove("hidden");
    menu_colorPicker.classList.add("hidden");
    menu_colorPickerDiv.style.backgroundColor = color;
    handleFontColor(color);
});

menu_colorPicker.addEventListener("mouseleave", () => {
    setTimeout(() => {
        menu_colorPickerBtn.classList.remove("hidden");
        menu_colorPicker.classList.add("hidden");
    }, 1000);
});

//formatting btn
menu_boldBtn.addEventListener("click", handleBold);
menu_underlineBtn.addEventListener("click", handleUnderline);
menu_italicBtn.addEventListener("click", handleItalic);
menu_strikethroughBtn.addEventListener("click", handleStrikethrough);

//alignment btn
menu_leftAlignBtn.addEventListener("click", (e) => {
    handleAlignment("left", e.target, getCurrentCell());
});
menu_rightAlignBtn.addEventListener("click", (e) => {
    handleAlignment("right", e.target, getCurrentCell());
});
menu_centerAlignBtn.addEventListener("click", (e) => {
    handleAlignment("center", e.target, getCurrentCell());
});

//font family btn
menu_fontFamily.addEventListener("change", () => {
    //update ui
    const cell = getCurrentCell();
    cell.style.fontFamily = menu_fontFamily.value;

    //update db
    const [rid, cid] = getCurrentCellRidCid();
    sheetDB[rid][cid].fontFamily = menu_fontFamily.value;

    //handle height because diff font changes the cell height
    handleCellHeight(cell);
});

//font size btn
menu_fontSize.addEventListener("change", () => {
    //update ui
    const cell = getCurrentCell();
    cell.style.fontSize = menu_fontSize.value + "px";

    //update db
    const [rid, cid] = getCurrentCellRidCid();
    sheetDB[rid][cid].fontSize = menu_fontSize.value;

    handleCellHeight(cell);
});

/********************GRID SECTION***************************/

//ADD SCROLL EVENT TO GRID
grid.addEventListener("scroll", handleGridScroll);

// ADDING EVENTS TO EACH CELL
const allCells = document.querySelectorAll(".grid__cells-container .grid__col");

allCells.forEach((cell) => {
    //CLICK EVENT
    cell.addEventListener("click", () => {
        updateAddressBox(cell);

        //remove active class form every cell
        allCells.forEach((c) => c.classList.remove("grid__col--active"));
        //add active class to current cell
        cell.classList.add("grid__col--active");

        //handle cell height due to active cell border
        handleCellHeight(cell);

        //update ui according to cell data
        const [rid, cid] = getCurrentCellRidCid();
        const cellObj = sheetDB[rid][cid];

        //bold btn update
        if (cellObj.bold) {
            menu_boldBtn.classList.add("menu-btn--active");
        } else {
            menu_boldBtn.classList.remove("menu-btn--active");
        }

        //underline btn update
        if (cellObj.underline) {
            menu_underlineBtn.classList.add("menu-btn--active");
        } else {
            menu_underlineBtn.classList.remove("menu-btn--active");
        }

        //italic btn update
        if (cellObj.italic) {
            menu_italicBtn.classList.add("menu-btn--active");
        } else {
            menu_italicBtn.classList.remove("menu-btn--active");
        }

        //strikethrough btn update
        if (cellObj.strikethrough) {
            menu_strikethroughBtn.classList.add("menu-btn--active");
        } else {
            menu_strikethroughBtn.classList.remove("menu-btn--active");
        }

        // alignment btn update
        switch (cellObj.alignment) {
            case "left":
                handleAlignment("left", menu_leftAlignBtn, cell);
                break;
            case "center":
                handleAlignment("center", menu_centerAlignBtn, cell);
                break;
            case "right":
                handleAlignment("right", menu_rightAlignBtn, cell);
                break;
        }

        //color picker update
        if (cellObj.color != "") {
            menu_colorPickerDiv.style.backgroundColor = cellObj.color;
        } else {
            menu_colorPickerDiv.style.backgroundColor = "black";
        }

        //font selector update
        menu_fontFamily.value = cellObj.fontFamily;

        //font size update
        menu_fontSize.value = cellObj.fontSize;

        //formula update
        formula_formulaBox.value = cellObj.formula;
    });

    //BLUR EVENT
    cell.addEventListener("blur", () => {
        const [rid, cid] = getCurrentCellRidCid();
        const cellObj = sheetDB[rid][cid];
        updateChildrenData(cellObj);
        handleCellHeight(cell);
    });

    //KEYUP EVENT
    cell.addEventListener("keyup", () => {
        const [rid, cid] = getCurrentCellRidCid();
        const cellObj = sheetDB[rid][cid];
        cellObj.value = cell.innerText;
        if (cellObj.formula != "") {
            removeFormula(cellObj.formula, formula_addressBox.value, cellObj);
        }
        handleCellHeight(cell);
    });
});

//selecting first cell on page load
allCells[0].click();

/****************************SHEET SECTION******************************* */
// Add new sheet btn event
sheets_addBtn.addEventListener("click", () => {
    addNewSheetToSheetList();
});

//adding click event to first sheet
const firstSheetEl = document.querySelector(".sheets__sheet");
firstSheetEl.addEventListener("click", handleSheetChange);

/*********************FORMULA LOGIC*****************/

const isCycle = function (cellID, formula) {
    const formulaArr = formula.split(" ");

    const cell = getCell(cellID);
    const rid = cell.getAttribute("rid");
    const cid = cell.getAttribute("cid");
    const cellObj = sheetDB[rid][cid];
    const children = cellObj.children;

    for (let i = 0; i < children.length; i++) {
        const childID = children[i];
        for (let j = 0; j < formulaArr.length; j++) {
            let ascii = formulaArr[j].charCodeAt(0);
            if (ascii >= 65 && ascii <= 90) {
                const parentCellID = formulaArr[j];
                if (parentCellID == childID) {
                    return true;
                }
            }
        }
        return isCycle(childID, formula);
    }

    return false;
};

formula_formulaBox.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        const formula = e.target.value;
        const cell = getCurrentCell();
        const [rid, cid] = getCurrentCellRidCid();
        const cellObj = sheetDB[rid][cid];

        const oldFormula = cellObj.formula;

        //if same formula entered return
        if (oldFormula == formula) {
            return;
        }

        //if non empty new formula entered remove old formula
        if (cellObj.formula != "") {
            removeFormula(cellObj.formula, formula_addressBox.value, cellObj);
        }
        //set new formula
        setChild(formula, formula_addressBox.value);

        //if cycle detected remove new formula and add old formula
        if (isCycle(formula_addressBox.value, formula)) {
            removeFormula(formula, formula_addressBox.value, cellObj);

            //set old formula
            setChild(oldFormula, formula_addressBox.value);

            cellObj.formula = oldFormula;
            formula_formulaBox.value = oldFormula;

            alert("cycle detected, formula didn't update");
            return;
        }

        //solve new formula
        const actualFormula = getFormula(formula);
        const value = evaluateFormula(actualFormula);

        //update ui
        cell.innerText = value;

        //update db
        cellObj.formula = formula;
        cellObj.value = value;
    }
});

/************KEYBOARD SHORTCUTS******************/
let isCtrlPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.key == "Control") isCtrlPressed = true;

    if (isCtrlPressed) {
        if (e.key == "b") handleBold();
        else if (e.key == "u") handleUnderline();
        else if (e.key == "i") handleItalic();
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key == "Control") isCtrlPressed = false;
});
