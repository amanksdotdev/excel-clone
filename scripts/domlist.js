"use strict";

/******** MENU SECTION************/

//filemenu
const menu_title = document.querySelector(".menu__title");
const menu_titleInput = document.getElementById("menu__title-input");
const menu_new = document.querySelector(".menu__new");
const menu_open = document.querySelector(".menu__open");
const menu_save = document.querySelector(".menu__save");

//formatting menu
const menu_fontFamily = document.querySelector("#font");
const menu_fontSize = document.querySelector("#fontsize");
const menu_boldBtn = document.querySelector(".menu-btn--bold");
const menu_underlineBtn = document.querySelector(".menu-btn--underline");
const menu_italicBtn = document.querySelector(".menu-btn--italic");
const menu_strikethroughBtn = document.querySelector(
    ".menu-btn--strikethrough"
);
const menu_colorPicker = document.querySelector(".font-color");
const menu_colorPickerBtn = document.querySelector(".menu-btn--fontColor");
const menu_colorPickerDiv = document.querySelector(".menu-btn--colorDiv");
const menu_leftAlignBtn = document.querySelector(".menu-btn--left");
const menu_centerAlignBtn = document.querySelector(".menu-btn--center");
const menu_rightAlignBtn = document.querySelector(".menu-btn--right");

/**********FORMULA SECTION*********** */

const formula_addressBox = document.querySelector(".formula__address-box");
const formula_formulaBox = document.querySelector(".formula__formula-box");

/************GRID SECTION************** */

const grid = document.querySelector(".grid");
const grid_leftCol = document.querySelector(".grid__left-col");
const grid_topRow = document.querySelector(".grid__top-row");
const grid_topLeftBlock = document.querySelector(".grid__top-left-block");
const grid_cellsContainer = document.querySelector(".grid__cells-container");

/****************SHEETS SECTION***************/
const sheets_addBtn = document.querySelector(".sheets__add-btn");
const sheets_list = document.querySelector(".sheets__list");
