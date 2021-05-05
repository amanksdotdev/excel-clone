const leftCol = document.querySelector(".left-col");
const topRow = document.querySelector(".top-row");
const grid = document.querySelector(".grid");

//Filler
// top row
let topRowStr = "";
for (let i = 0; i < 26; i++) {
    topRowStr += `<div class='col'>${String.fromCharCode(65 + i)}</div>`;
}
topRow.innerHTML = topRowStr;

// left col
let leftColBox = "";
for (let i = 0; i < 100; i++) {
    leftColBox += `<div class='left-col-box'>${i + 1}</div>`;
}
leftCol.innerHTML = leftColBox;

//grid
let gridStr = "";
for (let i = 0; i < 100; i++) {
    gridStr += `<div class='row'>`;
    for (let j = 0; j < 26; j++) {
        gridStr += `<div class='col' rid=${i} cid=${j} contenteditable="true"></div>`;
    }
    gridStr += `</div>`;
}
grid.innerHTML = gridStr;
