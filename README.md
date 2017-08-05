# expressq
Faster and simpler ExpressJS prototyping and application building.

[![NPM](https://nodei.co/npm/expressq.png)](https://nodei.co/npm/expressq/)

```js
// quickly build an express application with expressq
require('expressq')(5000, (app) => { /* single page serving example */
	// app.get, app.post, ..
	app.static('/','html/index.html');
});
// easily build multiple apps and take advantage of inbuilt customisable error reporting
require('expressq')(3000, (app) => {
	// supports standard ExpressJS methods
	app.get('/dynamic',(req, res) => {res.send(new Date())});
	// load, modify and send files with ease
	app.getFile('/time','html/dynamic.html',(req,res,file) => {
		file = file.replace(/<%time%>/g, new Date());
		res.send(file);
	});
	// create static files with just one line
	app.static('/','html/index.html');
	app.static('/throw500','html/does_not_exist.html');
	// modify error messages for requests ranging from [HTML, JSON, plaintext]
	app.confSet('err404_html', 'Oops! Couldn\'t find what you were looking for!');
}, () => {
	// if this function exists and is passed to expressq
	// it will be run when your app starts instead of the
	// default message
	console.log('Started!');
});
// also supports customisable 500 errors
```
