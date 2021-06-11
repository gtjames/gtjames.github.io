window.onload = function (){
}

function show(){
  menu.classList="";
  menu.classList.add('show');
  //menu.classList.remove('close');
}
function close(){
  menu.classList="";
  menu.classList.add('close');
}

document.getElementById('more').addEventListener('click', open);

function open(){
  var info = document.getElementById('info');
  info.classList.toggle('closed');
  info.classList.toggle('open');

}
