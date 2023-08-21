for (let ru = 0; ru < 2; ru++){
let canvas = document.querySelectorAll("#myCanvas")[ru];
//console.log(document.querySelectorAll("#myCanvas"),"tag")
//console.log(canvas);
////console.log(modelKey);
let ctx,lineW,fix_test,isDrawing;
ctx = canvas.getContext("2d", { willReadFrequently: true });
const erase = document.querySelector("#erase");
const pred = document.querySelector("#pred_num");
const exp = document.querySelector(".exp_can");
const guess_out = document.querySelector("#guess_out");
const bottomBar = document.querySelector(".bottomBar");
if (ru == 1){
canvas.style.marginTop = bottomBar.children[0].clientHeight + "px";
canvas.style.height = bottomBar.clientHeight - bottomBar.children[0].clientHeight + "px";
canvas.style.width = canvas.style.height;
exp.style.marginTop = canvas.style.marginTop;
exp.style.fontSize = exp.clientWidth / 15 +"px";
pred.addEventListener("click",getImage);
erase.addEventListener("click",()=>ctx.clearRect(0,0,canvas.width,canvas.height));
}

isDrawing = false;
ctx.strokeStyle = "white";
lineW = 2;
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener('contextmenu', event => event.preventDefault());
canvas.addEventListener('mouseover',context);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);

function context(e){
  ////console.log((e.clientX - canvas.getBoundingClientRect().left)/10, (e.clientY - canvas.getBoundingClientRect().top)/10);
}


////console.log("boundry",canvas.getBoundingClientRect().left,canvas.getBoundingClientRect().top)
function startDrawing(event) {
  ////console.log("boundry",canvas.getBoundingClientRect().left,canvas.getBoundingClientRect().top)
  isDrawing = true;
  ctx.beginPath();
  if (event.button == 0){
    ctx.strokeStyle = "white";
    ctx.lineWidth = lineW;
  }
  else if (event.button == 2){
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineW * 2;
  }
  let mouseX,mouseY;
  if ((event.clientX - canvas.getBoundingClientRect().left)/(canvas.clientWidth/28)){
    mouseX = (event.clientX - canvas.getBoundingClientRect().left)/(canvas.clientWidth/28);
    mouseY = (event.clientY - canvas.getBoundingClientRect().top)/(canvas.clientHeight/28);
  }
  else {
    mouseX = (event.touches[0].clientX - canvas.getBoundingClientRect().left)/(canvas.clientWidth/28);
    mouseY = (event.touches[0].clientY - canvas.getBoundingClientRect().top)/(canvas.clientHeight/28);
    ctx.strokeStyle = "white";
    ctx.lineWidth = lineW;
  }
  ctx.moveTo(mouseX, mouseY);
}
  
function draw(event) {
  event.preventDefault();
  if (isDrawing) {
    ////console.log((event.clientX - canvas.getBoundingClientRect().left)/(canvas.clientWidth/28),(event.clientY - canvas.getBoundingClientRect().top)/(canvas.clientHeight/28));
    let mouseX,mouseY;
    if ((event.clientX - canvas.getBoundingClientRect().left)/(canvas.clientWidth/28)){
      mouseX = (event.clientX - canvas.getBoundingClientRect().left)/(canvas.clientWidth/28);
      mouseY = (event.clientY - canvas.getBoundingClientRect().top)/(canvas.clientHeight/28);
    }
    else {
      mouseX = (event.touches[0].clientX - canvas.getBoundingClientRect().left)/(canvas.clientWidth/28);
     mouseY = (event.touches[0].clientY - canvas.getBoundingClientRect().top)/(canvas.clientHeight/28);
     ctx.strokeStyle = "white";
     ctx.lineWidth = lineW;
    }
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ////console.log(event.clientX,event.clientY)
  }
}
  
function stopDrawing(event) {
  isDrawing = false;
}
  
function getImage(){
  guess_out.innerHTML = "...";
    let imgList =[];
    let imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    ////console.log(imgData.data)
    let forI = imgData.width * imgData.height * 4
    for (rep = 1;rep<forI;rep+=4){
      imgList.push(imgData.data[rep]);
    }
    imgList.push(document.querySelector(".Custom").checked)
    imgList.push(document.querySelector(".AlpLet").checked)
    if (document.querySelector(".Custom").checked == true){
      imgList.push(keepLabels);
    }
    else{
      imgList.push([]);
    }
    imgList.push(modelKey);
    //console.log(imgList);
    sendList(imgList);
}

function sendList(imgList){
  let data = JSON.stringify(imgList);
  xml.open("POST","/draw/",true);
    xml.setRequestHeader("Content-type","application/json");
    xml.onload = function (){
        ////console.log(this.responseText);
        guess_out.innerHTML = this.responseText;
    }
    xml.send(data);
}

function eraseCanvas(){
  ctx.clearRect();
}}
