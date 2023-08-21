console.log("Welcome to MakeAI!");
/*
TO-DO:
Add data augmentation
Stop block jumping
*/ 
let doc = document;
let block1 = doc.querySelector(".dense");
let block2 = doc.querySelector(".conv");
let finish = doc.querySelector(".finish");
let start = doc.querySelector(".start");
let finishId = doc.getElementById("id_finish");
let startId = doc.getElementById("id_start");
let input_layer = doc.querySelector(".start_block");
let inptext = doc.querySelector(".inptext");
let input_def_text = "Input Layers : ";
const xml = new XMLHttpRequest();
let box_count = 0;
let edit;
let rmve;
const body = doc.querySelector("body");
const nav = doc.querySelector("nav");
let smScr = false;
let pass = true;
let vis = doc.querySelector(".vis");
if (window.innerHeight > window.innerWidth || window.innerHeight < 400 || window.innerWidth < 600){
    pass = false;
    let smallScreen = doc.querySelector(".warn_screen");
    vis.style.visibility = "hidden";
    //smScr = true;
    body.style.backgroundColor = "rgb(47, 48, 69)";
    smallScreen.style.visibility = "visible";
    smallScreen.style.textAlign = "center";
    smallScreen.style.position = "absolute";
    //smallScreen.style.marginTop = body.clientHeight / 2.5 + "px";
    smallScreen.style.marginTop = body.clientHeight / 5 + "px";
    smallScreen.style.fontSize = body.clientWidth / 50 + "px";
    ////console.log("hide")
    let smContinue = doc.querySelector("#smallContinue");
    smContinue.style.display = "block";
    smContinue.style.fontSize = smContinue.clientWidth / 10 + "px";
    //smContinue.style.marginTop = smallScreen.getBoundingClientRect().bottom + smContinue.clientHeight + "px";
    smContinue.style.marginTop = smallScreen.getBoundingClientRect().bottom + smContinue.clientHeight / 3 + "px";
    smContinue.style.marginLeft = (body.clientWidth / 2) - smContinue.clientWidth/2 + "px";
    smContinue.addEventListener("click",(e) => {mainRun()});
    window.addEventListener("keydown",(e) => {if (e.key == "Enter"){mainRun()}});
}
else {
    mainRun();
}
function mainRun() {
let timeout = 0;
//let currentPara = doc.querySelector(".current_params");
//currentPara.style.fontSize = currentPara.clientWidth / 17 + "px";
let smallScreen = doc.querySelector(".warn_screen");
smallScreen.style.display = "none";
let vis = doc.querySelector(".vis");
vis.style.visibility = "visible";
input_layer.style.fontSize = input_layer.clientWidth / 10 + "px";

let layer_block_text = doc.querySelector(".startText");
layer_block_text.style.fontSize = layer_block_text.clientWidth / 12 + "px"

let fin_heading = doc.querySelector(".fin_heading");
fin_heading.style.fontSize = layer_block_text.clientWidth / 12 + "px"

let press_submit = doc.querySelector("#press_submit");
press_submit.style.marginTop = start.clientHeight / 1.5 + "px";
let mkData = doc.querySelector(".mkData");
mkData.style.marginTop = press_submit.clientHeight + "px";
let startX = input_layer.getBoundingClientRect().left;
let startY = input_layer.getBoundingClientRect().top;
press_submit.style.fontSize = press_submit.clientWidth / 5 + "px";
mkData.style.fontSize = mkData.clientWidth / 5.5 + "px";
block1.style.height = start.clientHeight / 24 + "px";
block1.style.width = start.clientWidth / 1.5 + "px";
block1.style.fontSize = block1.clientWidth / 10 + "px";
block2.style.height = start.clientHeight / 24 + "px";
block2.style.width = start.clientWidth / 1.5 + "px";
block2.style.fontSize = block2.clientWidth / 10 + "px";
block2.style.marginTop = block1.clientHeight * 1.5 + "px";
let top2Save = block1.clientHeight * 1.5;
block1.style.visibility = "visible";
block2.style.visibility = "visible";
press_submit.style.visibility = "visible";
mkData.style.visibility = "visible";

finish.style.width = window.innerWidth - start.clientWidth - 1 + "px";

let xgrab,ygrab;

if (window.innerHeight>window.innerWidth) {
    block1.style.fontWeight = "bold";
    block2.style.fontWeight = "bold";
}

input_layer.addEventListener("click",resetCoorInput);

function resetCoorInput(e){
    if (with_in(input_layer,e.clientX,e.clientY)){
    input_layer.style.marginLeft = "42.5%";
    input_layer.style.marginTop = "5%";
    }
}

doc.addEventListener("click", checkClick);
function with_in(inside,cliX,cliY){
    let insideCoor = inside.getBoundingClientRect();
    let ifInside = false;
    ////console.log(`name: ${inside.className}\nleft: ${insideCoor.left}\ntop: ${insideCoor.top}`);
    if (cliX < insideCoor.right && cliX > insideCoor.left && cliY > insideCoor.top && cliY < insideCoor.bottom){
        ifInside = true;
    }
    ////console.log(`name: ${inside.className}\nleft: ${insideCoor.left}\nright: ${insideCoor.right}\nbottom: ${insideCoor.bottom}\ntop: ${insideCoor.top}\nbool: ${ifInside}`);
    return ifInside;
}

function resetBlock1(){
    block1.style.left = "0%";
    block1.style.top = "0%";
    block1.style.marginLeft = "15%";
    block1.style.marginTop = layer_block_text.clientHeight + "px";
    ////console.log("conf")
}
function resetBlock2(){
    block2.style.left = "0%";
    block2.style.top = "0%";
    block2.style.marginLeft = "15%";
    block2.style.marginTop = top2Save + layer_block_text.clientHeight + "px";
    ////console.log("conf")
}
//--------
function OnDrop(e,x,y) {
    ////console.log(e.target.className);
    let posX,posY;
    if (x != undefined){
        posX = x;
        posY = y;
    }
    else {
        posX = e.clientX - xgrab;
        posY = e.clientY + ygrab;
    }
    cleintRect = finish.getBoundingClientRect();
    posX -= cleintRect.left;
    posY -= cleintRect.top + fin_heading.clientHeight;
    //redBox.style.marginLeft = posX;
    //redBox.style.marginTop = posY;
    withInCalX = posX+start.clientWidth + xgrab;
    withInCalY = posY+nav.clientHeight+fin_heading.clientHeight - ygrab;
    if (e.target.className == "dropdown"){

    }
    else if (with_in(input_layer,withInCalX,withInCalY)){
        if (box_count < 3){
        input_layer.appendChild(clone_elem_inp(e.target));
        box_count++;
        inptext.innerHTML = `Input Layers: ${box_count}`;
        if (e.target.parentElement.className == "finish"){
            ////console.log("removed")
            finish.removeChild(e.target);
        }}
        else {
            alert("Too many layers, the limit is 3");
        }
    }
    else if (with_in(finish,withInCalX,withInCalY)){
        finish.appendChild(clone_elem_fin(e.target,posX,posY));
        if (e.target.parentElement.className == "start_block"){
            e.target.parentElement.removeChild(e.target);
            box_count--;
        inptext.innerHTML = `Input Layers: ${box_count}`;
        }
        else if (e.target.parentElement.className == "finish"){
            e.target.parentElement.removeChild(e.target);
        }
    }
    else if (!with_in(finish,withInCalX,withInCalY)){
        if (e.target.parentElement.className == "start_block"){
            e.target.parentElement.removeChild(e.target);
            box_count--;
        inptext.innerHTML = `Input Layers: ${box_count}`;
        }
        else if (e.target.parentElement.className == "finish"){
            e.target.parentElement.removeChild(e.target);
        }
    }
    resetBlock1();
    resetBlock2()
}

function clone_elem_fin(trg,posX,posY){
    elem = trg.cloneNode(true);
    //delete on touch 
    elem.addEventListener("click",(e) => {
        if (e.target.className == "dense" || e.target.className == "conv"){
        e.target.parentElement.removeChild(e.target);
        }
    });
    //setting stack
    elem.style.position = "absolute";
    elem.id = "inFin";
    elem.style.top = "0px";
    elem.style.left = "0px";
    elem.style.marginTop = posY + "px";
    elem.style.marginLeft = posX + "px";
    elem.style.marginRight = "0px";
    elem.style.marginBottom = "0px";
    elem.draggable = true;
    elem.addEventListener("dragend", OnDrop);
    elem.addEventListener("touchstart", (e) => {e.preventDefault()});
    elem.addEventListener("touchmove", (e) => {e.preventDefault();e.target.style.marginLeft = e.touches[0].clientX  - finish.getBoundingClientRect().left+ "px";e.target.style.marginTop = e.touches[0].clientY - finish.getBoundingClientRect().top + "px"});
    elem.addEventListener("touchend", (e) => {OnDrop(e,e.target.getBoundingClientRect().left,e.target.getBoundingClientRect().top)});
    ////console.log(elem.children)
    elem.children[0].addEventListener("click",dropClick);
    elem.children[0].addEventListener("touchstart",dropClick);
    return elem
}

function clone_elem_inp(trg){
    elem = trg.cloneNode(true);
    //delete on touch 
    elem.addEventListener("click",(e) => {
        if (e.target.className == "dense" || e.target.className == "conv"){
        e.target.parentElement.removeChild(e.target);box_count--;inptext.innerHTML = `Input Layers: ${box_count}`;
        }
    });
    //setting stack
    elem.style.position = "static";
    elem.id = "elem";
    elem.style.top = "0px";
    elem.style.left = "0px";
    elem.style.marginTop = "0px";
    elem.style.marginLeft = "10%";
    elem.style.marginRight = "0px";
    elem.style.marginBottom = "0px";
    elem.draggable = true;
    elem.addEventListener("dragend", OnDrop);
    elem.addEventListener("touchstart", (e) => {
        if (e.target.className == "dense" || e.target.className == "conv"){
        e.target.parentElement.removeChild(e.target);box_count--;inptext.innerHTML = `Input Layers: ${box_count}`;
        }});
    elem.children[0].addEventListener("click",dropClick);
    elem.children[0].addEventListener("touchstart",dropClick);
    //elem.addEventListener("touchmove", (e) => {e.preventDefault();e.target.style.left = e.touches[0].clientX + "px";e.target.style.top = e.touches[0].clientY + "px"});
    //elem.addEventListener("touchend", (e) => {OnDrop(e,e.target.getBoundingClientRect().left,e.target.getBoundingClientRect().top)});
    return elem
}

const block1Y = start.getBoundingClientRect().top;
const block1X = block1.getBoundingClientRect().left;
const block2Y = start.getBoundingClientRect().top;
const block2X = block2.getBoundingClientRect().left;

//const redBox = doc.querySelector(".redBox");
//vis.addEventListener("touchmove",(e)=>{redBox.style.left = e.touches[0].clientX + "px";redBox.style.top = e.touches[0].clientY + "px"});

block1.addEventListener("touchstart", (e) => {e.preventDefault();/*//console.log("Start");*/block1.style.marginTop = "0px";});
block1.addEventListener("touchmove", (e) => {e.preventDefault();block1.style.left = e.touches[0].clientX - block1X + "px";block1.style.top = e.touches[0].clientY - block1Y + "px"});
block1.addEventListener("touchend", (e) => {OnDrop(e,block1.getBoundingClientRect().left,block1.getBoundingClientRect().top)});

block2.addEventListener("touchstart", (e) => {e.preventDefault();/*//console.log("Start");*/block2.style.marginTop = "0px";});
block2.addEventListener("touchmove", (e) => {e.preventDefault();block2.style.left = e.touches[0].clientX - block2X + "px";block2.style.top = e.touches[0].clientY - block2Y + "px"});
block2.addEventListener("touchend", (e) => {OnDrop(e,block2.getBoundingClientRect().left,block2.getBoundingClientRect().top)});

input_layer.addEventListener("touchstart", (e) => {e.preventDefault();/*//console.log("Start")*/});
input_layer.addEventListener("touchmove", (e) => {
    if ((e.target.className == "start_block" || e.target.className == "inptext")  && with_in(finish,e.touches[0].clientX,input_layer.style.top = e.touches[0].clientY-input_layer.clientHeight-fin_heading.clientHeight)){
    e.preventDefault();input_layer.style.left = e.touches[0].clientX - startX + "px";input_layer.style.top = e.touches[0].clientY - startY + "px"
    }
});
input_layer.addEventListener("touchend", (e) => {OnDropStart(e,input_layer.getBoundingClientRect().left - startX,input_layer.getBoundingClientRect().top - startY)});

function OnDropStart(e, x , y){
    let dragPosX,dragPosY;
    ////console.log(e.target.className);
    if (e.target.className != "start_block"){

    }
    else if (x != undefined){
        dragPosX = x;
        dragPosY = y; 
        if (with_in(finish,dragPosX,dragPosY)){
            let true_pos_y = dragPosY;
            let true_pos_x = dragPosX;
            input_layer.style.marginTop = true_pos_y + "px";
            input_layer.style.marginLeft = true_pos_x + "px";
    }}
    else {
        dragPosX = e.clientX;
        dragPosY = e.clientY; 
        
    if (with_in(finish,dragPosX,dragPosY)){
        let true_pos_y = dragPosY - finish.getBoundingClientRect().top - fin_heading.clientHeight;
        let true_pos_x = dragPosX - finish.getBoundingClientRect().left;
        input_layer.style.marginTop = true_pos_y + "px";
        input_layer.style.marginLeft = true_pos_x + "px";
    }}

}

start.addEventListener('dragover',(e) => {e.preventDefault();});
finish.addEventListener('dragover',(e) => {e.preventDefault();});
start.addEventListener('dragenter',(e) => {e.preventDefault();});
finish.addEventListener('dragenter',(e) => {e.preventDefault();});
start.addEventListener('dragleave',(e) => {e.preventDefault();});
finish.addEventListener('dragleave',(e) => {e.preventDefault();});


block1.addEventListener("dragstart", (e) => {xgrab = e.clientX-block1.getBoundingClientRect().left;ygrab = e.clientY-block1.getBoundingClientRect().top})
block1.addEventListener("dragend", OnDrop);
block2.addEventListener("dragstart", (e) => {xgrab = e.clientX-block2.getBoundingClientRect().left;ygrab = e.clientY-block2.getBoundingClientRect().top})
block2.addEventListener("dragend", OnDrop);
input_layer.addEventListener("dragend", OnDropStart);
let childList = [];
let readout = doc.querySelector(".read_out");

function deleter() {
    xml.open("POST","/delete/",false)
    xml.setRequestHeader("Content-type","application/json");
    xml.onload = function () {/*//console.log(this.responseText)*/};
    xml.send(JSON.stringify(modelKey));
}

function sendInfo(){
    let currTimeCalc = new Date();
    let calcTime = currTimeCalc.getTime();
    if ((calcTime - timeout) >= 15000){
    timeout = calcTime;
    ////console.log("Rebuilding")
    deleter();
    readout.innerHTML = "<br><br>Test Accuracy: ...<br>Model: ...<br>Parameters: ...<br>Training Time: ... sec<br>";
    let send = []
    for (let ite = 0; ite<box_count;ite++){
        let tempList = [];
        ////console.log(input_layer.children[ite+1]);
        if (input_layer.children[ite+1] != undefined){
        let layName = input_layer.children[ite+1].getAttribute("class");
        tempList.push({"name":layName});
        for (let rep = 0; rep < input_layer.children[1].children.length; rep++){
        let inpVal = input_layer.children[ite+1].children[1].children[rep].children[0].value;
        let inpName = input_layer.children[ite+1].children[1].children[rep].children[0].className;
        tempList.push({[inpName]:inpVal});
        }
        childList.push(tempList);
        }
    }
    send.push(childList);
    let epochs = doc.querySelector(".epochs").value;
    let lr = doc.querySelector(".lr").value;
    send.push(epochs);
    send.push(lr);
    send.push(LetAlpCheck.checked);
    send.push(CustomCheck.checked);
    if (CustomCheck.checked == true){
        send.push(polishedData);
        send.push(CustomLabel);
        keepLabels = CustomLabel;
    }
    else {
        send.push([]);
        send.push([]);
    }
    ////console.log(`epochs ${epochs} \nlr ${lr}`);
    ////console.log(send);
    /*let data = {"Name":"john","age":"47"};*/
    let data = JSON.stringify(send);
    ////console.log(data);
    let TimeSend = new Date();
    let TimeSendFirstMS = TimeSend.getTime()
    xml.open("POST","/main/",true);
    xml.setRequestHeader("Content-type","application/json");
    xml.onload = function (){
        let TimeSendSecond = new Date();
        let TimeSendSecondMS = TimeSendSecond.getTime()
        let total_time = TimeSendSecondMS - TimeSendFirstMS;
        let res = this.responseText.split("=");
        ////console.log(res);
        if (res == "105"){
            readout.innerHTML = `<br><br>Model too big<br>Try reducing layers or nodes<br><br>Test Accuracy: None<br>Model: None<br>Parameters: None<br>Training Time: ${total_time/1000} sec<br>`;
        }
        else {
            let handler;
            if (res[0] != 10100){
                handler = Math.round(res[0]) + "%";
            }
            else {
                handler = "No Data"
            }
            readout.innerHTML = `<br><br>Test Accuracy: ${handler}<br>Model: ${res[1]}<br>Parameters: ${res[res.length-1]}<br>Training Time: ${total_time/1000} sec<br>`;
            if (CustomCheck.checked == true){
                doc.querySelector(".data").innerHTML = "Custom";
            }
            else {
                doc.querySelector(".data").innerHTML = "Pre Made Numbers";
            }
            doc.querySelector(".tt").innerHTML = total_time/1000;
            doc.querySelector(".para").innerHTML = res[res.length-1]
            let currTime = new Date();
            timeout = currTime.getTime();
        }
        modelKey = res[2];
        ////console.log(modelKey);
    }
    xml.send(data);
    childList = [];
    }
    else {
        alert(`Model training cool down of 15 seconds, ${(calcTime-timeout)/1000} seconds has passed`);
    }
}
press_submit.addEventListener("click",sendInfo);

let dropdown = block1.querySelector(".dropdown");
let dropdownConv = block2.querySelector(".dropdown");
let dropdownId = doc.getElementById("dropdown");
let hoverShow = doc.getElementById("hoverShow");
let allClicked = false;
////console.log("happens");
//dropdown.addEventListener("click",dropClick);
//dropdownConv.addEventListener("click",dropClick);
let lastHover;
function dropClick(e){
    let hover = e.target.parentElement.children[1];
    if (!(lastHover == undefined)){
        checkClick(e);
        allClicked = true;
    }
    let saveState = hover.style.visibility;
    docClick(e);
    hover.style.visibility = saveState;
    if (hover.style.visibility == "visible"){
        hover.style.visibility = "hidden";
    }
    else if (hover.style.visibility == "hidden"){
        hover.style.visibility = "visible";
    }
    else{
        hover.style.visibility = "visible";
    }
    lastHover = e.target.parentElement;
}

function docClick(e){
    let targets = doc.querySelectorAll("#hoverShow");
    ////console.log(targets)
    targets.forEach(closeFunct);
}

function closeFunct(trg){
    ////console.log(trg);
    trg.style.visibility = "hidden";
}

function checkClick(e){
    ////console.log(lastHover.children)
    ////console.log(!(with_in(lastHover.children[1],e.clientX,e.clientY)) && !(with_in(lastHover.children[0],e.clientX,e.clientY)))
    try{
    if (!(with_in(lastHover.children[1],e.clientX,e.clientY)) && !(with_in(lastHover.children[0],e.clientX,e.clientY)) && allClicked == false){
        ////console.log("close");
        lastHover.children[1].style.visibility = "hidden";
    }}
    catch{}
    if (allClicked == true){
        allClicked = false;
    }
}

let sidebar = doc.querySelector(".sidebar");
let openClose = doc.querySelector(".openClose");
let charSidebar = doc.querySelector(".openArrow");
openClose.addEventListener("click", sideFunct);
let switchSidebar = false;

sidebar.style.fontSize = (sidebar.clientWidth - openClose.clientWidth)/20 + "px";


function sideFunct(e){
    if (switchSidebar == false){
        sideAnimation();
        switchSidebar = true;
        charSidebar.innerHTML = "&#8249;";
    }
    else {
        sideAnimation();
        switchSidebar = false;
        charSidebar.innerHTML = "&#8250;";
    }
}
let target;
let dirrection;
let init;

//Window begining

let win = doc.querySelector(".window");
win.style.marginLeft = body.clientWidth / 8 + "px";
win.style.marginTop = body.clientHeight / 8 + "px";
win.style.width = body.clientWidth / 8 * 6 + "px";
win.style.height = body.clientHeight / 8 * 6 +"px";
mkData.addEventListener("click", openWindow);
let backButton = doc.querySelector(".back_button");
let fwrdButton = doc.querySelector(".fwrd_button");

//Initilizing Variables
let LetAlpCheck = doc.querySelector(".AlpLet");
let CustomCheck = doc.querySelector(".Custom");
LetAlpCheck.addEventListener("click", (e) => {CustomCheck.checked = false})
CustomCheck.addEventListener("click", (e) => {LetAlpCheck.checked = false})
let CustomData = [];
let CustomLabel = [];
let polishedData = [];
let ImageDisNum = 0;
let create = true;
let MultiCan = doc.querySelectorAll(".multiCan");
let MultiFunc = doc.querySelectorAll(".disCan");
let AllCanvas = [];
let Page = 0;
let Selected = null;
let keepDis = false;

//Display Canvas Init
try{
    for (let u = 0; u < MultiCan.length;u++){
        AllCanvas.push(MultiCan[u].getContext('2d'));
        MultiFunc[u].addEventListener("mouseenter",(e) => {
            if (u + Page*16 < CustomData.length){
                MultiFunc[u].style.opacity = 0.5;
                //MultiFunc[u].style.boxSizing = "border-box";
                MultiCan[u].style.backgroundColor = "green";
                labelDis.style.visibility = "visible";
                if (keepDis == false){
                    labelDis.innerHTML = CustomLabel[u + Page*16];
                }
                //e.target.style.border = "red solid 100px";
            }});
            MultiFunc[u].addEventListener("mouseleave",(e) => {
                if (u + Page*16 < CustomData.length){
                    MultiFunc[u].style.opacity = 1;
                    //MultiFunc[u].style.boxSizing = "border-box";
                    MultiCan[u].style.backgroundColor = "black";
                    if (keepDis == false){
                        labelDis.style.visibility = "hidden";
                    }
                    //e.target.style.border = "red solid 100px";
                }
        });
        MultiFunc[u].addEventListener("click",(e) => {
            if (Selected != null){
                removeSelection(e);
            }
            if (u + Page*16 < CustomData.length){
                if (Selected == u + Page*16){
                    removeSelection(e);
                    keepDis = false;
                    Selected = null;
                    MultiCan[u].style.backgroundColor = "green"; 
                }
                else{
                labelDis.style.visibility = "visible";
                labelDis.innerHTML = CustomLabel[u + Page*16];
                keepDis = true;
                Selected = u + Page*16;
                MultiCan[u].style.border = "red 1px solid";
                }
            }
    });
    }
}
catch(rr){
    mkData.style.backgroundColor = "blue";
    mkData.innerHTML = rr;
}
//coordinating window display

let winHead = doc.querySelector(".win_head");
winHead.style.fontSize = winHead.clientWidth/20 + "px";

let winHeader = doc.querySelector(".head_head");
winHeader.style.marginTop = (winHead.clientHeight-winHeader.clientHeight)/2 + "px";

let escWin = doc.querySelector(".esc_win");
escWin.style.marginTop = (winHead.clientHeight-escWin.clientHeight)/2 + "px";
escWin.style.fontSize = escWin.clientHeight / 1.5 + "px";

let delClear = doc.querySelector(".del_clear");
delClear.style.marginTop = (win.clientHeight - delClear.clientHeight) * 0.97 + "px";
delClear.style.marginLeft = (win.clientWidth - delClear.clientWidth) * 0.03 + "px";
delClear.style.fontSize = delClear.clientHeight / 1.5 + "px";


let showCan = doc.querySelector(".can_show");
let CanCon = showCan.getContext('2d',{ willReadFrequently: true });

let addData = doc.querySelector(".add_data");
addData.style.marginLeft = (win.clientWidth - addData.clientWidth) * 0.97 + "px";
addData.style.marginTop = (win.clientHeight - addData.clientHeight) * 0.97 + "px";
addData.style.fontSize = addData.clientHeight / 1.5 + "px";

let newRev = doc.querySelector(".new_rev");
newRev.style.marginLeft = (win.clientWidth - newRev.clientWidth) * 0.97 + "px";
newRev.style.marginTop = (win.clientHeight - newRev.clientHeight) * 0.03 + "px";
newRev.style.fontSize = newRev.clientHeight / 2.5 + "px";

let LabelMaker = doc.querySelector(".labeler");
let label = doc.querySelector(".Label");
LabelMaker.style.marginTop = win.clientHeight / 16 * 13.5 + "px";
LabelMaker.style.marginLeft = (win.clientWidth / 2) - (label.clientWidth) + "px";
//console.log(label.clientWidth)
//console.log((win.clientWidth / 2) - (label.clientWidth/2) + "px");
//CanCon.putImageData();

//fwrdButton.style.fontSize =  "100px";
fwrdButton.style.marginTop = ((win.clientHeight - winHead.clientHeight)/1.8) + "px";
fwrdButton.style.marginLeft = (win.clientWidth/32)*29 + "px";

backButton.style.marginTop = ((win.clientHeight - winHead.clientHeight)/1.8) + "px";
backButton.style.marginLeft = (win.clientWidth/32)*3  + "px";

let labelDis = doc.querySelector(".labelDis");
labelDis.style.marginLeft = (win.clientWidth / 2) - (labelDis.clientWidth)/2 + "px";
labelDis.style.marginTop = win.clientHeight / 16 * 13.5 + "px"

//functionallity

//Img to list
function convert(img){
    temp = [];
    let forI = img.width * img.height * 4
    for (rep = 1;rep<forI;rep+=4){
      temp.push(img.data[rep]);
    }
    polishedData.push(temp);
}

//Deleting
delClear.addEventListener("click", (e) => {
    if (create == true){
        CanCon.clearRect(0,0,showCan.width,showCan.height);
        label.value = "";
    }
    else{
        if (Selected != null){
            CustomData.splice(Selected,1)
            CustomLabel.splice(Selected,1)
            polishedData.splice(Selected,1)
            updateImage();
        }
    }
});

//Adding
addData.addEventListener("click", (e) => {
    if (label.value != ""){
        CreateData(CanCon.getImageData(0,0,showCan.width,showCan.height),label.value)
    }
    else {
        alert("No label is given for data, cannot add to dataset without label")
    }
})

//Switching Windows
newRev.addEventListener("click",DisplayData);

//Coordinates page displays
winHead.addEventListener("click", nextPos);

//moves pages foward or back
backButton.addEventListener("click", (e) => {Page--;nextPos()})
fwrdButton.addEventListener("click", (e) => {Page++;nextPos()})

//updates data display
function updateImage(){
    for (let r = 0; r < MultiCan.length/4; r++){
        for (let c = 0; c < MultiCan.length/4;c++){
            displayImage(0,r,c);
        }
    }
    try{
        if (CustomLabel[Selected] == undefined){
            labelDis.innerHTML == ""
            labelDis.style.visibility = "hidden";
            keepDis = false;
        }
        else{
            labelDis.innerHTML = CustomLabel[Selected];
        }
    }
    catch (ler)
    {
        keepDis = false;
    }
}

//moves pages fucntion
function nextPos() {
    if (Page < 0){
        //mkData.innerHTML = "-";
        Page++;
    }
    else if (Page >= Math.ceil(CustomData.length/16)){
        //mkData.innerHTML = Page >= Math.ceil(CustomData.length/16) + "+";
        Page--;
    }
    else{
        //mkData.innerHTML + "=";
    for (let r = 0; r < MultiCan.length/4; r++){
        for (let c = 0; c < MultiCan.length/4;c++){
            displayImage(Page,r,c);
    }}}
}


//adds data to list
function CreateData(image,label){
    CustomData.push(image);
    CustomLabel.push(label);
    convert(image);
}
//displays specfic canvas
function displayImage(pg,r,c){
    try {
        //let canRef = (MultiCan[(r*4)+c]).getContext('2d');
        AllCanvas[(r*4)+c].putImageData(CustomData[(r*4)+c+(pg*16)],0,0);
        MultiCan[(r*4)+c].style.opacity = "1";
        MultiCan[(r*4)+c].style.backgroundColor = "black";
    }
    catch(errorCa){
        //let canRef = (MultiCan[(r*4)+c]).getContext('2d');
        AllCanvas[(r*4)+c].clearRect(0,0,MultiCan[(r*4)+c].width,MultiCan[(r*4)+c].height);
        //mkData.innerHTML = AllCanvas;
        MultiCan[(r*4)+c].style.opacity = "0.1";
        MultiCan[(r*4)+c].style.backgroundColor = "black";
        MultiCan[(r*4)+c].style.border = "";
    }
}

//Coordinates switching between windows
function DisplayData(){
    if (create == true){
        labelDis.style.visibility = "hidden";
        LabelMaker.style.visibility = "hidden";
        addData.style.visibility = "hidden";
        showCan.style.visibility = "hidden";
        backButton.style.visibility = "visible";
        fwrdButton.style.visibility = "visible";
        newRev.innerHTML = "Review";
        create = false;
        try {
        for (let r = 0; r < MultiCan.length/4; r++){
            for (let c = 0; c < MultiCan.length/4;c++){
                MultiCan[(r*4)+c].style.visibility = "visible";
                MultiCan[(r*4)+c].style.marginLeft = (win.clientWidth/8)+(win.clientWidth/6)*(c+1)-MultiCan[(r*4)+c].clientWidth+"px";
                MultiCan[(r*4)+c].style.marginTop = winHead.clientHeight+(win.clientHeight-winHead.clientHeight)/7*(r+1)+"px";
                displayImage(0,r,c);
            }
        }
    }
        catch(err) {
            mkData.style.backgroundColor = "red";
            //mkData.innerHTML = err;
        }
    }
    else {
        labelDis.style.visibility = "hidden";
        LabelMaker.style.visibility = "visible";
        addData.style.visibility = "visible";
        showCan.style.visibility = "visible";
        backButton.style.visibility = "hidden";
        fwrdButton.style.visibility = "hidden";
        newRev.innerHTML = "Create";
        create = true;
        for (let u = 0; u < MultiCan.length;u++){
            MultiCan[u].style.visibility = "hidden";
        }
    }
}

//removes element from list
function removeSelection(e){
    MultiCan[Selected].style.border = "";
    MultiCan[Selected].style.backgroundColor = "black";
}

//handles escapes
body.onclick = (e) => {
    if ((!with_in(win,e.clientX,e.clientY) && win.style.visibility == "visible" && e.target.className != "mkData") || e.target.className == "esc_win"){
    labelDis.style.visibility = "hidden";
    addData.style.visibility = "hidden";
    LabelMaker.style.visibility = "hidden";
    win.style.visibility = "hidden";
    showCan.style.visibility = "hidden";
    backButton.style.visibility = "hidden";
    fwrdButton.style.visibility = "hidden";
    CanCon.clearRect(0,0,showCan.width,showCan.height)
    //console.log("hiding",e.target.className,e.target.className != "mkData")
    vis.style.opacity = 1;
    canChoice = 1;
    for (let u = 0; u < MultiCan.length;u++){
        MultiCan[u].style.visibility = "hidden";
    }
}
else{
}};

//Opens window
function openWindow(e){
    labelDis.style.visibility = "hidden";
    backButton.style.visibility = "hidden";
    fwrdButton.style.visibility = "hidden";
    addData.style.visibility = "visible";
    LabelMaker.style.visibility = "visible";
    canChoice = 0;
    vis.style.opacity = 0.3;
    win.style.visibility = "visible";
    showCan.style.visibility = "visible";
    create = true;
    newRev.innerHTML = "Create";
}
//openWindow();
let newPlace;



//end of window section

let sideIn = body.clientWidth - openClose.clientWidth + "px";
let sideOut =  body.clientWidth - sidebar.clientWidth + "px";
sidebar.style.marginLeft = sideOut;
if (smScr == false){
    sidebar.style.visibility = "visible";
}

sidebar.children[1].style.height = sidebar.children[1].clientHeight - 1 +"px";
/*sidebar.children[2].style.height = sidebar.children[2].clientHeight - 1 +"px";*/

function sideAnimation(){
    if (sidebar.style.marginLeft == sideIn){
        newPlace = sideOut;
    }
    else {
        newPlace = sideIn;
    }
    sidebar.style.marginLeft = newPlace;
}

let openArrow = document.querySelector(".openArrow");
openArrow.style.marginTop = sidebar.clientHeight / 2.25 + "px";
openArrow.style.fontSize = openArrow.clientWidth / 1.10 + "px"; 

let bottomSidebar = doc.querySelector(".bottomBar");
let bottomOpenClose = doc.querySelector(".bottomOpenClose");
let buttons = doc.querySelectorAll(".side_button_can");

for (let repe = 0; repe<buttons.length;repe++){
    buttons[repe].style.fontSize = buttons[repe].clientWidth / 6 + "px";
}
bottomOpenClose.style.fontSize = bottomOpenClose.clientHeight / 2 + "px";
/*openClose.style.fontSize = openClose.clientWidth / 2 + "px";*/

bottomOpenClose.addEventListener("click", bottomSideAnimation);

let bottomIn = body.clientHeight - bottomOpenClose.clientHeight  - nav.clientHeight + "px";
let bottomOut = body.clientHeight - bottomSidebar.clientHeight  - nav.clientHeight + "px";

bottomSidebar.style.marginTop = bottomOut;
if (smScr == false){
bottomSidebar.style.visibility = "visible";
}

function bottomSideAnimation(){
    if (bottomSidebar.style.marginTop == bottomIn){
        newPlace = bottomOut;
        bottomOpenClose.innerHTML = "&dArr;";
    }
    else {
        newPlace = bottomIn;
        bottomOpenClose.innerHTML = "^";
    }
    bottomSidebar.style.marginTop = newPlace;
}}
window.addEventListener("resize",(e) => {
    let bottomSidebar = doc.querySelector(".bottomBar");
    let sidebar = doc.querySelector(".sidebar");
    sidebar.style.visibility = "hidden";
    bottomSidebar.style.visibility = "hidden";
    xml.open("POST","/delete/",false)
    xml.setRequestHeader("Content-type","application/json");
    xml.send(JSON.stringify(modelKey));
    location.reload();
    if (modelKey != ""){
    alert("Due to a window refresh your model was deleted, sorry for the inconvience");
    }
    modelKey = "";
})

window.addEventListener("unload",(e) => {
    xml.open("POST","/delete/",true)
    xml.setRequestHeader("Content-type","application/json");
    xml.send(JSON.stringify(modelKey));
    alert("Due to a window refresh your model was deleted, sorry for the inconvience");
})


window.addEventListener("beforeunload", (e) => {
    xml.open("POST","/delete/",true)
    xml.setRequestHeader("Content-type","application/json");
    xml.send(JSON.stringify(modelKey));
    alert("Due to a window refresh your model was deleted, sorry for the inconvience");
})

function misc(){
    xml.open("POST","/misc/",true)
    xml.setRequestHeader("Content-type","application/json");
    xml.onload = (e) => {}
    xml.send("");
    console.log("It will be done my lord")
}
