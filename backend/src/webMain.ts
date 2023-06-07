import express  from "express";
import hbs  from "hbs";
import {config} from "./util/ConfigUtil";

const port = config("ADMIN_PORT");

var entries = [
	{"id":1, "title":"第一篇", "body":"正文", "published":"6/2/2013"},
	{"id":2, "title":"第二篇", "body":"正文", "published":"6/3/2013"},
	{"id":3, "title":"第三篇", "body":"正文", "published":"6/4/2013"},
	{"id":4, "title":"第四篇", "body":"正文", "published":"6/5/2013"},
	{"id":5, "title":"第五篇", "body":"正文", "published":"6/10/2013"},
	{"id":6, "title":"第六篇", "body":"正文", "published":"6/12/2013"}
];

export const serverWeb = express();

serverWeb.set('view engine', 'html');
serverWeb.engine('html', hbs.__express);

serverWeb.get('/', function(req, res) {
   res.render('index',{title:"最近文章", entries:entries});
});

serverWeb.get('/about', function(req, res) {
   res.render('about', {title:"自我介绍"});
});

serverWeb.get('/article/:id', function(req, res) {
   var entry = entries[0];
   res.render('article',{title:entry.title, blog:entry});
});

serverWeb.listen(port);

console.log("Web client connected !");
console.log('Client url is "127.0.0.1:'+port+'"');
