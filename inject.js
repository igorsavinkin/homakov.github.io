id = 9245370;
target = 'https://gist.github.com/homakov/b9d351e4e40274fa6a40';
try{
    a = new XMLHttpRequest;
    a.open('get', 'https://news.ycombinator.com/item?id=' + id, false);
    a.send();
    auth = (a.responseText.split('auth=')[1].split('&')[0]);
    location = 'https://news.ycombinator.com/vote?for=' + id + '&dir=up&auth=' + auth + '&goto=' + encodeURIComponent(target);
}catch(e){
    location = target;
}
