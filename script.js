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

// FUNCTIONS
const handleActiveSheet = function (e) {
    const sheet = e.currentTarget;
    const sheetsArr = document.querySelectorAll(".sheet");
    sheetsArr.forEach((sheet) => {
        sheet.classList.remove("active-sheet");
    });

    if (!sheet.classList.contains("active-sheet")) {
        sheet.classList.add("active-sheet");
    }
};

const resetSelected = function (btn) {
    const alignmentContainer = document.querySelector(".alignment-container");
    const allbtn = alignmentContainer.children;
    for (let i of allbtn) {
        i.classList.remove("selected");
    }
    btn.classList.add("selected");
};

const getCurrentCell = function () {
    let cellId = document.querySelector(".address-box").value;
    let [cid, rid] = cellId.split(/(\d+)/); // split string with number
    cid = cid.charCodeAt(0) - 65; // convert char to num
    rid--; // reduce rid to match idx

    return document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
};

const getCell = function (cellId) {
    let [cid, rid] = cellId.split(/(\d+)/); // split string with number
    cid = cid.charCodeAt(0) - 65; // convert char to num
    rid--; // reduce rid to match idx

    return document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
};

const alignmentHandler = function (alignment) {
    // const [cid, rid] = getCellAddress();
    const cell = getCurrentCell();
    cell.style.textAlign = alignment;
};

// EVENT LISTENERS

//add new sheet
firstSheet.addEventListener("click", handleActiveSheet);
addsheetBtn.addEventListener("click", () => {
    const sheetArr = document.querySelectorAll(".sheet");
    const lastSheetElem = sheetArr[sheetArr.length - 1];
    let idx = lastSheetElem.getAttribute("sheetIdx");
    idx = Number(idx);
    const newSheet = document.createElement("div");
    newSheet.classList.add("sheet");
    newSheet.classList.add("cursor-pointer");
    newSheet.setAttribute("sheetIdx", idx + 1);
    newSheet.innerText = `Sheet ${idx + 2}`;
    newSheet.addEventListener("click", handleActiveSheet);

    sheetList.appendChild(newSheet);
});

// alignment handler
leftAlign.addEventListener("click", () => {
    alignmentHandler("left");
});
centerAlign.addEventListener("click", () => {
    alignmentHandler("center");
});
rightAlign.addEventListener("click", () => {
    alignmentHandler("right");
});

// getting cell row and col data
for (let cell of AllCells) {
    cell.addEventListener("click", (e) => {
        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));

        let rowAddress = rid + 1;
        let colAddress = String.fromCharCode(cid + 65);
        let address = colAddress + rowAddress;

        addressBox.value = address;

        if (cell.classList.contains("bold")) {
            document.querySelector(".bold-btn").style.backgroundColor = "#777";
        } else {
            document.querySelector(".bold-btn").style.backgroundColor = "";
        }
    });
}

//selecting first cell initially
AllCells[0].click();

//font size input handle
fontSizeInput.addEventListener("change", () => {
    const cell = getCurrentCell();
    const fontSize = fontSizeInput.value;
    cell.style.fontSize = fontSize + "px";
});

//bold button handle
document.querySelector(".bold-btn").addEventListener("click", (e) => {
    const cell = getCurrentCell();
    cell.classList.toggle("bold");
    
});

//underline btn handle
document.querySelector(".underline-btn").addEventListener("click", () => {
    const cell = getCurrentCell();
    cell.classList.toggle("underline");
});

//italic btn handle
document.querySelector(".italic-btn").addEventListener("click", () => {
    const cell = getCurrentCell();
    cell.classList.toggle("italic");
});

//font changer
document.getElementById("fonts").addEventListener("change", (e) => {
    const cell = getCurrentCell();
    const fontElement = e.currentTarget;
    const font = fontElement.value;
    cell.style.fontFamily = font;
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

// //funciton input
// document.querySelector(".formula-box").addEventListener("keydown", (e) => {
//     if (e.key == "Enter") {
//         let formula = e.currentTarget.value;

//     }
// });
