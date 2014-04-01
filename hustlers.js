var http = require('http');
var https = require('https');
var get = require('get');

var fs = require('fs');

var hustlers = [];
var bounties = [];

/*
Actually I am not a programmer so don't tell me how shitty this code is. peace
Online: http://www.sakurity.com/hustlers
*/

var exclude = ['Arthur Gerkis'];

done = function(){
  hustlers.sort(function(a,b){
    return b.bounties.length-a.bounties.length
  });

  for(var i=0,l=hustlers.length;i<l;i++){
  	details = [];
  	for(var key in hustlers[i].details){
      details.push(key+(hustlers[i].details[key]>1 ? " ("+hustlers[i].details[key]+")" : ''));
  	}

    var handle = hustlers[i].handles[0];

    if(exclude.indexOf(handle) != -1) continue;

    if(handle[0] == '@'){
      handle = handle.substr(1);
      handle = '<a href="https://twitter.com/'+handle+'">@'+handle+"</a>";
    }

    result += ("<tr><td>"+(i+1)+"</td><td width=''>" + handle + "</td><td>" + details.join(', ') + "</td></tr>")
  }

  result = 'Bounty Hustlers [last update '+new Date +'] [aggregated from '+aggr.join(' | ')+']<br><table border=1><tr><td>#</td><td width=200>Handle</td><td>Bounties</td></tr>' + result + '</table>';
  fs.writeFile("../high-lightning-427/hustlers.html", result, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
  });
}

upgrade_hustler = function(h,id){
  h.bounties.push(id);
  if(bounties[id].found){
    bounties[id].found++;
  }else{
    bounties[id].found=1;
  }
  if(h.details[bounties[id].name]){
    h.details[bounties[id].name] += 1
  }else{
    h.details[bounties[id].name] = 1
  }
}

lookup_hustler = function(name){
  //normalize twitter handle
  //twitter.com/_RaviRamesh
  tw = /(?:[^a-zA-Z])(twitter\.com\/|@)([A-Za-z0-9_]{1,15})/.exec(name)
  if(tw){
    name = '@'+tw[2];
  }else{
    name = name.replace(/<.*?>/g,'');
    name = name.split(/\s?\(?(of|from)/)[0]
  }
  name = name.trim();

  for(var i=0,l=hustlers.length;i<l;i++){
    if(hustlers[i].handles.indexOf(name) != -1){
      return hustlers[i];
    }
  }
  num = hustlers.push({
    handles: [name],
    reward: 0,
    bounties: [],
    details: {}
  });
  return hustlers[num-1];
}

bounties.push({
  name: "Ebay",
  url: 'http://pages.ebay.com/securitycenter/ResearchersAcknowledgement.html',
  cb: function(r, id){

    var res;
    var reg  = /<li>(.*?)<\/li>/g;
    var html = /</;
    while ((res = reg.exec(r)) !== null){
      if(!html.test(res[1])){
        h = lookup_hustler(res[1]);
        upgrade_hustler(h,id);
      }
    }
  }
})

bounties.push({
  name: "Chromium",
  url: 'http://www.chromium.org/Home/chromium-security/hall-of-fame',
  cb: function(r, id){
    var res;
    var reg  = /<li>(.*?)<\/li>/g;
    while ((res = reg.exec(r)) !== null){

      item = res[1].split(/\sfor/)[0];
      item = item.split(/\sto\s/).reverse();

      h = lookup_hustler(item[0]);
      upgrade_hustler(h,id);
      if(item.length == 2)
        h.reward += parseInt(item[1].substr(1))
    }
  }
})

bounties.push({
  name: "Google",
  url: 'http://www.google.com/about/appsecurity/hall-of-fame/reward/',
  cb: function(r, id){

    var res;
    var reg  = /td>\s*<td class="name">\s*(.*?)\s*</g
    var html = /</;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);

    }
  }
})

bounties.push({
  name: "Adobe",
  url: 'http://www.adobe.com/support/security/bulletins/securityacknowledgments.html',
  cb: function(r, id){

    var res;
    var reg  = /<li>(.*?)<\/li>/g;
    // extract the list
    r=r.split('Security Bulletin')[1].split('</ul>')[0];
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "AT&T",
  url: 'http://developer.att.com/developer/apiDetailPage.jsp?passedItemId=13400790',
  cb: function(r, id){
    var res;
    var reg  = />(.*?)<\/td>\s*<td class="last/g
    var html = /</;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);

    }
  }
})

bounties.push({
  name: "Barracuda",
  url: 'http://barracudalabs.com/research-resources/bug-bounty-program/bug-bounty-hall-of-fame/',
  cb: function(r, id){
    var res;
    var reg  = /<td>(.*?)<\/td>\s*<\/tr/g
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);

    }
  }
})

bounties.push({
  name: "Coinbase",
  url: 'http://coinbase.com/whitehat',
  cb: function(r, id){
    var res;
    r=r.split('h5>Awards')[1];
    var reg  = /<li>(.*?)<\/li>/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Dropbox",
  url: 'https://www.dropbox.com/special_thanks',
  cb: function(r, id){
    var res;
    r=r.split('thanks-go-to')[1].split('responsible-disclosure')[0];
    var reg  = /<li>(.*?)<\/li>/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Gitlab",
  url: 'http://www.gitlab.com/vulnerability-acknowledgements/',
  cb: function(r, id){
    var res;
    r=r.split('<ul')[2];
    var reg  = /<li>(.*?)<\/li>/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "GitHub",
  url: 'https://bounty.github.com/bounty-hunters.html',
  cb: function(r, id){
    var res;
    var reg  = /<li>([\s\S]*?)<\/li>/g;
    var tmp;
    while ((res = reg.exec(r)) !== null){
      var tmp = res[1]
        .replace(/\s+/g, ' ')
        .replace(/^([^<]+)\x20-\x20(?:<[ai]|@).*/g, '$1')
        .trim();
      if (tmp.indexOf('<a href') == 0) {
        continue;
      }
      h = lookup_hustler(tmp);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Yahoo",
  url: 'http://bugbounty.yahoo.com/security_wall.html',
  cb: function(r, id){
    var res;
    r=r.split('header-badge')[1];
    var reg  = /<li>(.*?)<\/li>/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Zynga",
  url: 'http://company.zynga.com/security/whitehats',
  cb: function(r, id){
    var res;
    r=r.split('>Thanks!')[1];
    var reg  = /<li>(.*?)<\/li>/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Yandex",
  url: 'http://company.yandex.com/security/hall-of-fame.xml',
  cb: function(r, id){
    var res;
    var reg  = /<tr>\s*<td class="b-research__t-td">\s*<p>\s*(.*?)<\/p>/g; // to detect new line b/w <tr> & <td * >.. & get all listing perfectly.
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Zendesk",
  url: 'http://www.zendesk.com/company/responsible-disclosure-policy',
  cb: function(r, id){
    var res;
    var reg  = /<br\/>\s*(.{1,400})\s*<br\/>/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Apple",
  url: 'http://support.apple.com/kb/HT1318',
  cb: function(r, id){
    var res;
    var reg  = /We would like to acknowledge (.*?) for/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Nokia",
  url: 'http://www.nokia.com/global/security/acknowledgements/',
  cb: function(r, id){
    var res;
    var reg  = />(.*?)<\/td><td/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Microsoft",
  url: 'http://technet.microsoft.com/en-us/security/cc308575',
  cb: function(r, id){
    var res;
    var reg  = /<strong>(.*?)<\/strong>/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Soundcloud",
  url: 'http://help.soundcloud.com/customer/portal/articles/439715-responsible-disclosure',
  cb: function(r, id){
    var res;
    r=r.split('we really appreciate it')[1].split('span style')[0];
    var reg  = /-(.*?)<br/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Shopify",
  url: 'https://www.shopify.com/security-response',
  cb: function(r, id){
    var res;
    r=r.split('Thank you!</h3')[1].split('sub-call-to-action')[0];
    var reg  = /<p>(.*?)<\/p>/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Stack Exchange",
  url: 'http://stackexchange.com/about/security',
  cb: function(r, id){
    var res;
    var reg = /<td>[0-9\-]+<\/td><\/td><td>([^<]+)<\/td>/g;
    while ((res = reg.exec(r)) !== null) {
      h = lookup_hustler(res[1]);
      upgrade_hustler(h, id);
    }
  }
});

bounties.push({
  name: "Facebook",
  url: 'https://www.facebook.com/whitehat/thanks/',
  cb: function(r, id){
    var res;
    r = r.replace('064;', '@');
    var reg  = /<span class="fsm">(.*?)<\/span>/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Heroku",
  url: 'https://www.heroku.com/policy/security-hall-of-fame',
  cb: function(r, id){
    var res;
    r=r.split('Security Researcher')[1].split('article>')[0];
    var reg  = /<li>(.*?)<\/li>/g;
    while ((res = reg.exec(r)) !== null){
      res[1] = res[1].split(' (')[0];
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Red hat",
  url: 'https://access.redhat.com/site/articles/66234',
  cb: function(r, id){
    var res;
    r=r.split('Please avoid using')[1].split('like a public acknowledgement')[0];
    var reg  = /<li>(.*?)<\/li>/g;
    while ((res = reg.exec(r)) !== null){
      data = res[1].split(' [');
      h = lookup_hustler(data[0]);
      num = 1;
      if(data[1]){
        num = parseInt(data[1]);
      }
      while(num--){
        upgrade_hustler(h,id);
      }

    }
  }
})

bounties.push({
  name: "Twitter",
  url: 'https://about.twitter.com/company/security',
  cb: function(r, id){
    var res;
    var reg  = />([^<]*?)<\/a><\/span>\s*<\/div>\s*<\/div>/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "Etsy",
  url: 'http://www.etsy.com/help/article/2463',
  cb: function(r, id){
    var res;
    r=r.split('vulnerabilities to us in the past')[1];
    var reg  = />(.*?)<br \/>/g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

bounties.push({
  name: "PayPal",
  url: 'https://www.paypal.com/webapps/mpp/security-tools/wall-of-fame-honorable-mention',
  cb: function(r, id){
    var res;
    var reg  = /xl65">(.*?)</g;
    while ((res = reg.exec(r)) !== null){
      h = lookup_hustler(res[1]);
      upgrade_hustler(h,id);
    }
  }
})

var requested = bounties.length;
var result = '';
var aggr = [];
for (id = 0, l = bounties.length; id < l; id++) {
  var callback = (function(cb, id) {
    return function(err, res) {
      if (err) throw err;
      cb(res, id);
      aggr.push("<a href='"+bounties[id].url+"'>"+bounties[id].name+' ('+bounties[id].found+')</a>');
      console.log(bounties[id].name, 'found', bounties[id].found);
      if (--requested == 0) done();
    }
    })(bounties[id].cb, id)

  //transport = get //bounties[id].url[4] == 's' ? https : http;
  get(bounties[id].url).asString(callback);
}
