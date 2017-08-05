/* requires */
const express = require('express');
const fs      = require('fs');

module.exports = (PORT, CREATE_ROUTER, ON_LISTEN_CALLBACK) => {
	/* create Express app */
	const app = express();
	/* instance variables */
	var vars = {
		err404_html:      '404: Not found',
		err404_json:      {error: 'Not found'},
		err404_plaintext: 'Not found',
		err500_html:      '500: Internal server error<br/>[error]',
		err500_json:      {error: 'Internal server error'},
		err500_plaintext: 'Internal server error\n[error]'
	};
	/* create router */
	var router = express.Router();
	/* configuration function */
	router['confSet'] = (i,v) => { vars[i] = v; };
	/* quick static file generation */
	router['static'] = (r,f) => { router.all(r,(req,res)=>{res.send(fs.readFileSync(f).toString())}); };
	/* convenience functions */
	router['getFile'] = (r,f,c) => { router.get(r,(req,res)=>{c(req,res,fs.readFileSync(f).toString())}); };
	router['postFile'] = (r,f,c) => { router.post(r,(req,res)=>{c(req,res,fs.readFileSync(f).toString())}); };
	router['allFile'] = (r,f,c) => { router.all(r,(req,res)=>{c(req,res,fs.readFileSync(f).toString())}); };
	/* create router */
	CREATE_ROUTER(router);
	/* add router */
	app.use('/', router);
	/* 404 handling */
	app.use(function(req, res, next){
		res.status(404);
		req.accepts('html') ? res.send(vars.err404_html)
		: req.accepts('json') ? res.send(vars.err404_json)
		: res.send(vars.err404_plaintext);
	});
	/* 500 handling */
	app.use(function (err, req, res, next) {
		console.error(err.stack);
		res.status(500);
		req.accepts('html') ? res.send(vars.err500_html.replace(/\[error\]/g,err).replace(/\[error_stack\]/g,err.stack))
		: (req.accepts('json')) ? res.send(vars.err500_json)
		: res.send(vars.err500_plaintext.replace(/\[error\]/g,err).replace(/\[error_stack\]/g,err.stack));
	});
	/* start listening */
	app.listen(PORT,()=>{
		if (typeof ON_LISTEN_CALLBACK==='undefined')
			console.log('Created new Express web server.');
		else
			ON_LISTEN_CALLBACK();
	});
};