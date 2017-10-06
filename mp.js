#!/usr/bin/env node --harmony-async-await

let fs = require('fs');
let inquirer = require('inquirer');
let prompt = inquirer.createPromptModule();
let yargs = require('yargs');
let path = require("path")


yargs.usage('Usage: \n  $0 <command> [options]')
	 .alias('h', 'help')
     .epilog('Copyright 2017 MINAPages.com')
     .argv;




// 页面系列函数
let argv = yargs
.command("web", 
	"-n <page> 新增一个空白WEB页面\n    " +
	"-c <src page> <new page> 复制一个页面\n    " +
	"-d <page> 删除一个页面",
{
	new: {
		alias: 'n'
	},
	delete: {
		alias: 'd'
	},
	copy: {
		alias: 'c'
	}
},
function( argv ){

	if ( typeof argv.new != 'undefined') {

		WebCreate( argv ).then(function( resp ){
			console.log( resp );
		}).catch(function(error){
			console.log( error );
		});
	} else if ( typeof argv.delete != 'undefined') {
		WebDelete( argv ).then(function( resp ){
			console.log( resp );
		}).catch(function(error){
			console.log( error );
		});
	} else if ( typeof argv.copy != 'undefined') {
		WebCopy( argv ).then(function( resp ){
			console.log( resp );
		}).catch(function(error){
			console.log( error );
		});
	} else {
		yargs.showHelp();
	}

}).help().argv
;


if ( argv._[0] != 'web') {

	yargs.showHelp();
}

// yargs.command("put", "just test", {
// 	url: {
// 		alias: 'u',
// 		default: "http://www.sina.com"
// 	}
// },
// function( argv ){
// 	console.log(argv.url);
// })
// .help()
// .argv
// ;

// yargs.showHelp();



/**
 * 根据输入页面，猜出页面路径
 * @param  {[type]} page [description]
 * @return {[type]}      [description]
 */
function guessPagePath( page ){

	let cwd = process.cwd();
	let pi = path.parse(page );


	if ( pi.root == ''){
		pi['root'] = cwd;
	}

	let page_root = path.join(pi.root, pi.dir );
	let page_name = pi.base;

	// 查找 web.json 文件
	let web_root = findWebRoot( page_root );
	if ( web_root === false) {
		return web_root;
	}

	return {
		webroot: web_root, 
		pageroot:page_root, 
		basename:page_name,
		pagename:path.join(page_root.replace(web_root, '/'),page_name)
	};

}


function findWebRoot( page_root ) {

	let js = path.join(page_root, 'web.js');
	let json = path.join(page_root, 'web.json');
	let pi = path.parse(page_root);

	if ( pi['root'] == page_root ) {
		return false;
	}

	if ( fs.existsSync(js) && fs.existsSync(json)  ) {
		return page_root;
	} else {
		return findWebRoot( path.join(page_root, '..') );
	}

}



function WebCreate (argv) {

	return new Promise(function(resolve, reject) {

		let pi = guessPagePath( argv.new );
		if ( pi === false ) {
			reject("不是 MINA Pages WEB 应用目录");
			return;
		}

		// 校验路径地址
		prompt([
			{type:"confirm",name:"webroot",   message:"项目配置文件 " + pi.webroot + "web.json:"},
			{type:"confirm",name:"pageroot",   message:"页面路径 " + pi.pageroot + ":"},
			{type:"confirm",name:"pagename",   message:"页面名称 " + pi.pagename + ":"}

		]).then(function (answers) {

			for( var i in answers) {
				if ( answers[i] !== true ) {
					reject("取消操作");
					return;
				}
			}

		// 填写配置信息		
			return prompt([
				{type:"input",name:"cname",   message:"页面中文名称: ", default:"又一个WEB页面" },
				{type:"input",name:"router",  message:"页面中文路由 (例: /article/{id:\\\\d+}): ", default:pi.pagename },
				{type:"input",name:"desktop", message:"兼容桌面浏览器: ", default:"yes"},
				{type:"input",name:"mobile",  message:"兼容手机浏览器: ", default:"yes"},
				{type:"input",name:"wechat",  message:"兼容微信浏览器: ", default:"yes"},
				{type:"input",name:"wxapp",   message:"微信小程序页面地址: ", default:pi.pagename }
			]);

		}).then(function (conf) {

		// 创建（或拷贝）文件
			
			var timestamp = Date.parse(new Date()); 

			// page.json
			let page_file = path.join(pi.pageroot, pi.basename);

			let json_file = path.resolve(__dirname,'source', "page.json");
			let contentText = fs.readFileSync(json_file,'utf-8');
			contentText = contentText.replace(/%%cname%%/gi, conf.cname);
			contentText = contentText.replace(/%%router%%/gi, conf.router);
			contentText = contentText.replace(/%%datetime%%/gi, timestamp);

			let alias = ['desktop', 'mobile', 'wechat', 'wxapp'];
			let alias_data = [];

			for( var i in alias){
				var n = alias[i];
				if ( conf[n] != 'yes' ) {
					alias_data.push( '"'+n+'":'+ '"'+  conf[n] +'"');
				}
			}

			contentText = contentText.replace(/%%alias%%/gi, alias_data.join(",\n\t\t"));
			fs.writeFileSync(page_file +'.json', contentText);

			// page.js
			let src_file = path.resolve(__dirname,'source', "page.js");
			contentText = fs.readFileSync(src_file,'utf-8');
			contentText = contentText.replace(/%%datetime%%/gi, timestamp);
			fs.writeFileSync(page_file +'.js', contentText);

			// page.page
			src_file = path.resolve(__dirname,'source', "page.page");
			contentText = fs.readFileSync(src_file,'utf-8');
			contentText = contentText.replace(/%%datetime%%/gi, timestamp);
			fs.writeFileSync(page_file +'.page', contentText);

			// page.less
			src_file = path.resolve(__dirname,'source', "page.less");
			contentText = fs.readFileSync(src_file,'utf-8');
			contentText = contentText.replace(/%%datetime%%/gi, timestamp);
			fs.writeFileSync(page_file +'.less', contentText);

		    resolve('创建成功');

		}).catch(function( error ){
			reject(error);
		})
	});
}

function WebDelete( argv ){
	return new Promise(function(resolve, reject){

		let pi = guessPagePath( argv.delete );
		if ( pi === false ) {
			reject("不是 MINA Pages WEB 应用目录");
			return;
		}

		let page_file = path.join(pi.pageroot, pi.basename);

		if ( !fs.existsSync( page_file + '.json') && 
			 !fs.existsSync( page_file + '.js') &&
			 !fs.existsSync( page_file + '.page') &&
			 !fs.existsSync( page_file + '.less')
		) {
			reject("页面不存在");
			return;
		}

		prompt([
			{
				type:"confirm",name:"webroot",   
				default:false,
				message:
					"请确认删除页面 " + pi.pagename + 
					"\n文件 "+page_file+".page" +
					"\n文件 "+page_file+".less" +
					"\n文件 "+page_file+".js" +
					"\n文件 "+page_file+".json\n" 
			},

		]).then(function (answers) {

			for( var i in answers) {
				if ( answers[i] !== true ) {
					reject("取消操作");
					return;
				}
			}

			fs.unlinkSync(page_file+".page");
			fs.unlinkSync(page_file+".less");
			fs.unlinkSync(page_file+".js");
			fs.unlinkSync(page_file+".json");
			resolve("删除成功");
		});
		
	});
}

function WebCopy(){
	return new Promise(function(resolve, reject){
		console.log(__dirname);
		resolve("done");
	});
}