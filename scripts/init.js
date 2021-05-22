//initializing grid

// top row
let topRowStr = "";
for (let i = 0; i < 26; i++) {
    topRowStr += `<div class='grid__col grid__col--top'>${String.fromCharCode(
        65 + i
    )}</div>`;
}
grid_topRow.innerHTML = topRowStr;

// left col
let leftColBox = "";
for (let i = 0; i < 100; i++) {
    leftColBox += `<div class='grid__left-col-box'>${i + 1}</div>`;
}
grid_leftCol.innerHTML = leftColBox;

//grid
let gridStr = "";
for (let i = 0; i < 100; i++) {
    gridStr += `<div class='grid__row'>`;
    for (let j = 0; j < 26; j++) {
        gridStr += `<div class='grid__col' rid=${i} cid=${j} contenteditable="true"></div>`;
    }
    gridStr += `</div>`;
}
grid_cellsContainer.innerHTML = gridStr;