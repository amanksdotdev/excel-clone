//DOM OBJECTS
const addsheetBtn = document.querySelector(".add-sheet_container");
const sheetList = document.querySelector(".sheets-list");
const firstSheet = document.querySelector(".sheet");

const leftAlign = document.querySelector(".left-align");
const centerAlign = document.querySelector(".center-align");
const rightAlign = document.querySelector(".right-align");
const AllCells = document.querySelectorAll(".grid .col");

const addressBox = document.querySelector(".address-box");

const fontSizeInput = document.getElementById("font-size");

let sheetDB = workSheetDB[0];
// FUNCTIONS
const handleActiveSheet = function (e) {
    const sheet = e.currentTarget;

    //handling active sheet class
    const sheetsArr = document.querySelectorAll(".sheet");
    sheetsArr.forEach((sheet) => {
        sheet.classList.remove("active-sheet");
    });

    if (!sheet.classList.contains("active-sheet")) {
        sheet.classList.add("active-sheet");
    }

    //handling active sheet data and UI
    let sheetIdx = sheet.getAttribute("sheetIdx");
    console.log(sheetIdx);
    sheetDB = workSheetDB[sheetIdx];

    setUI(sheetDB);
};

const resetSelected = function (btn) {
    const alignmentContainer = document.querySelector(".alignment-container");
    const allbtn = alignmentContainer.children;
    for (let i of allbtn) {
        i.classList.remove("selected");
    }
    btn.classList.add("selected");
};

const getCurrentCellRidCid = function () {
    let cellId = document.querySelector(".address-box").value;
    let [cid, rid] = cellId.split(/(\d+)/); // split string with number
    cid = cid.charCodeAt(0) - 65; // convert char to num
    rid--; // reduce rid to match idx
    return [rid, cid];
};

const getCurrentCell = function () {
    let [rid, cid] = getCurrentCellRidCid();
    return document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
};

const getCell = function (cellId) {
    let [cid, rid] = cellId.split(/(\d+)/); // split string with number
    cid = cid.charCodeAt(0) - 65; // convert char to num
    rid--; // reduce rid to match idx

    return document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
};

const alignmentHandler = function (alignment, targetBtn) {
    // const [cid, rid] = getCellAddress();
    const cell = getCurrentCell();
    cell.style.textAlign = alignment;

    //reset active-btn class
    leftAlign.classList.remove("active-btn");
    centerAlign.classList.remove("active-btn");
    rightAlign.classList.remove("active-btn");
    targetBtn.classList.add("active-btn");
};

const initUI = function () {
    let AllCells = document.querySelectorAll(".grid .col");
    for (let i = 0; i < AllCells.length; i++) {
        // boldness
        AllCells[i].style.fontWeight = "normal";
        AllCells[i].style.fontStyle = "normal";
        AllCells[i].style.textDecoration = "none";
        AllCells[i].style.fontFamily = "Roboto";
        AllCells[i].style.fontSize = "16px";
        AllCells[i].style.textAlign = "left";
        AllCells[i].innerText = "";
    }
};

const setUI = function () {
    for (let i = 0; i < sheetDB.length; i++) {
        for (let j = 0; j < sheetDB[i].length; j++) {
            let cell = document.querySelector(`.col[rid="${i}"][cid="${j}"]`);
            let {
                bold,
                italic,
                underline,
                fontFamily,
                fontSize,
                alignment,
                value,
            } = sheetDB[i][j];
            cell.style.fontWeight = bold == true ? "bold" : "normal";
            cell.style.fontStyle = italic == true ? "italic" : "normal";
            cell.style.textDecoration =
                underline == true ? "underline" : "none";
            cell.style.fontSize = fontSize;
            cell.style.textAlign = alignment;
            cell.style.fontFamily = fontFamily;
            cell.innerText = value;
        }
    }
    AllCells[0].click();
    fontSizeInput.value = sheetDB[0][0].fontFamily;
};

const updateDB = function (cell) {
    //1. getting cell row and col of cell and setting in addressBox
    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));

    let cellObj = sheetDB[rid][cid];

    //2. if cell has any formatting then activating it and save to sheet db
    if (cell.style.fontWeight == "bold") {
        cellObj.bold = true;
    } else {
        cellObj.bold = false;
    }

    if (cell.style.textDecoration == "underline") {
        cellObj.underline = true;
    } else {
        cellObj.underline = false;
    }

    if (cell.style.fontStyle == "italic") {
        cellObj.italic = true;
    } else {
        cellObj.italic = false;
    }

    //allignment active btn handling

    if (cell.style.textAlign == "right") {
        cellObj.alignment = "right";
    } else {
        cellObj.alignment = "left";
    }

    if (cell.style.textAlign == "center") {
        cellObj.alignment = "center";
    } else {
        cellObj.alignment = "left";
    }

    cellObj.value = cell.innerText || "";
    cellObj.fontFamily = cell.style.fontFamily || "Roboto";
    cellObj.fontSize = cell.style.fontSize || "16px";
};

// EVENT LISTENERS
//**********add new sheet************
firstSheet.addEventListener("click", handleActiveSheet);
addsheetBtn.addEventListener("click", () => {
    let sheetArr = document.querySelectorAll(".sheet");
    const lastSheetElem = sheetArr[sheetArr.length - 1];
    let idx = lastSheetElem.getAttribute("sheetIdx");
    idx = Number(idx);
    const newSheet = document.createElement("div");
    newSheet.classList.add("sheet");
    newSheet.classList.add("cursor-pointer");
    newSheet.setAttribute("sheetIdx", idx + 1);
    newSheet.innerText = `Sheet ${idx + 2}`;

    //page add
    sheetList.appendChild(newSheet);

    //change active sheet class
    sheetArr.forEach((sheet) => {
        sheet.classList.remove("active-sheet");
    });
    sheetArr = document.querySelectorAll(".sheet");
    sheetArr[sheetArr.length - 1].classList.add("active-sheet");

    //add new sheetDB to worksheetDB
    initSheet();

    //update sheetDB var to current active sheet idx
    sheetDB = workSheetDB[idx];

    //updating UI
    initUI();

    //change sheet
    newSheet.addEventListener("click", handleActiveSheet);

    //handling active sheet data and UI
    let sheetIdx = newSheet.getAttribute("sheetIdx");
    console.log(sheetIdx);
    sheetDB = workSheetDB[sheetIdx];

    setUI(sheetDB);
});

//****Adding click event to every cell*******
for (let cell of AllCells) {
    cell.addEventListener("click", () => {
        //1. getting cell row and col of cell and setting in addressBox
        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));

        let rowAddress = rid + 1;
        let colAddress = String.fromCharCode(cid + 65);
        let address = colAddress + rowAddress;

        addressBox.value = address;

        let cellObj = sheetDB[rid][cid];

        //2. if cell has any formatting then activating it and save to sheet db
        if (cell.style.fontWeight == "bold") {
            document.querySelector(".bold-btn").classList.add("active-btn");
        } else {
            document.querySelector(".bold-btn").classList.remove("active-btn");
        }

        if (cell.style.textDecoration == "underline") {
            document
                .querySelector(".underline-btn")
                .classList.add("active-btn");
            cellObj.underline = true;
        } else {
            document
                .querySelector(".underline-btn")
                .classList.remove("active-btn");
            cellObj.underline = false;
        }

        if (cell.style.fontStyle == "italic") {
            document.querySelector(".italic-btn").classList.add("active-btn");
            cellObj.italic = true;
        } else {
            document
                .querySelector(".italic-btn")
                .classList.remove("active-btn");
            cellObj.italic = false;
        }

        //allignment active btn handling
        leftAlign.classList.add("active-btn");
        if (cell.style.textAlign == "right") {
            leftAlign.classList.remove("active-btn");
            rightAlign.classList.add("active-btn");
            cellObj.alignment = "right";
        } else {
            rightAlign.classList.remove("active-btn");
            cellObj.alignment = "left";
        }

        if (cell.style.textAlign == "center") {
            leftAlign.classList.remove("active-btn");
            centerAlign.classList.add("active-btn");
            cellObj.alignment = "center";
        } else {
            centerAlign.classList.remove("active-btn");
            cellObj.alignment = "left";
        }

        cellObj.value = cell.innerText || "";
        cellObj.fontFamily = cell.style.fontFamily || "Roboto";
        cellObj.fontSize = cell.style.fontSize || "16px";
        console.log(cellObj);
    });

    cell.addEventListener("keyup", () => {
        updateDB(cell);
    });
}

//selecting first cell initially
AllCells[0].click();

//*********FORMATTING BUTTONS********** */
//font size input handle
fontSizeInput.addEventListener("change", () => {
    const cell = getCurrentCell();
    const fontSize = fontSizeInput.value;
    cell.style.fontSize = fontSize + "px";
});

//bold button handle
document.querySelector(".bold-btn").addEventListener("click", (e) => {
    let isActive = e.target.classList.contains("active-btn");
    const cell = getCurrentCell();
    const [rid, cid] = getCurrentCellRidCid();
    const cellObj = sheetDB[rid][cid];

    if (!isActive) {
        cell.style.fontWeight = "bold";
        e.target.classList.add("active-btn");
        cellObj.bold = true;
    } else {
        cell.style.fontWeight = "normal";
        e.target.classList.remove("active-btn");
        cellObj.bold = false;
    }
});

//underline btn handle
document.querySelector(".underline-btn").addEventListener("click", (e) => {
    let isActive = e.target.classList.contains("active-btn");
    const cell = getCurrentCell();
    const [rid, cid] = getCurrentCellRidCid();
    const cellObj = sheetDB[rid][cid];

    if (!isActive) {
        cell.style.textDecoration = "underline";
        e.target.classList.add("active-btn");
        cellObj.underline = true;
    } else {
        cell.style.textDecoration = "none";
        e.target.classList.remove("active-btn");
        cellObj.underline = false;
    }
});

//italic btn handle
document.querySelector(".italic-btn").addEventListener("click", (e) => {
    let isActive = e.target.classList.contains("active-btn");
    const cell = getCurrentCell();
    const [rid, cid] = getCurrentCellRidCid();
    const cellObj = sheetDB[rid][cid];

    if (!isActive) {
        cell.style.fontStyle = "italic";
        e.target.classList.add("active-btn");
        cellObj.italic = true;
    } else {
        cell.style.fontStyle = "normal";
        e.target.classList.remove("active-btn");
        cellObj.italic = false;
    }
});

//font changer
document.getElementById("fonts").addEventListener("change", (e) => {
    const cell = getCurrentCell();
    const [rid, cid] = getCurrentCellRidCid();
    const cellObj = sheetDB[rid][cid];
    const fontElement = e.currentTarget;
    const font = fontElement.value;
    cell.style.fontFamily = font;
    cellObj.fontFamily = font;
});

//font color change
document.getElementById("fgcolor").addEventListener("change", (e) => {
    const cell = getCurrentCell();
    const fontColorEl = e.currentTarget;
    const color = fontColorEl.value;
    console.log(color);
    cell.style.color = color;
});

//cell background color
document.getElementById("bgcolor").addEventListener("change", (e) => {
    const cell = getCurrentCell();
    const fontColorEl = e.currentTarget;
    const color = fontColorEl.value;
    console.log(color);
    cell.style.backgroundColor = color;
});

// alignment handler
leftAlign.addEventListener("click", (e) => {
    alignmentHandler("left", e.target);
});
centerAlign.addEventListener("click", (e) => {
    alignmentHandler("center", e.target);
});
rightAlign.addEventListener("click", (e) => {
    alignmentHandler("right", e.target);
});
