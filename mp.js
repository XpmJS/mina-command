#!/usr/bin/env node
let yargs = require('yargs');

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
		WebRemove( argv ).then(function( resp ){
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


function WebCreate(){
	return new Promise(function(resolve, reject){
		resolve("done");
	});
}

function WebRemove(){
	return new Promise(function(resolve, reject){
		resolve("done");
	});
}

function WebCopy(){
	return new Promise(function(resolve, reject){
		resolve("done");
	});
}