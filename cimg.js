#!/usr/bin/env node

require('colors');

let fs = require('fs');
let path = require('path');
let sharp = require('sharp');

function getFileSize(path){
	return fs.statSync(path).size;
}

sharp.prototype.toFileForce = async function(path){

	return new Promise((resolve, reject) => {

		this.toBuffer(function(err, buffer){

			if(err) {
				reject(err);
			}else{
				fs.writeFileSync(path, buffer);
				resolve(this);
			}

		});

	});

}

async function compressImage(from, to){

	try {

		let inputBuffer = fs.readFileSync(from);
		let input = await sharp(inputBuffer);
		let inputSize = getFileSize(from);

		let output = await input.png({compressionLevel : 9});

		await output.toFile(to);

		let outputSize = getFileSize(to);

		let percent = (outputSize / inputSize);
		percent = (1 - percent);
		percent = Math.floor(percent * 100);

		console.log('Compressed:'.green, from.blue, to.cyan, percent + '%');

	}catch (e){
		console.log('Error:'.red, from.blue);
	}

	return false;

}

async function compressDirectoryImages(from, to){

	fs.readdirSync(from).forEach(file => {

		let target_from = path.resolve(from, file),
			target_to = path.resolve(to, file);

		if(fs.lstatSync(target_from).isDirectory()){

			if(!fs.existsSync(target_to)){
				fs.mkdirSync(target_to);
			}

			return compressDirectoryImages(target_from, target_to);

		}else{

			let ext = path.extname(target_from);

			switch(ext){

				case '.jpeg':
				case '.jpg':
				case '.png':
				case '.gif':
					return compressImage(target_from, target_to);

			}

		}

	});

}


//////////////////////
if(process.argv.length < 3){
	console.log('No input directory'.red);
	process.exit();
}

let input = path.resolve(process.argv[2].trim());

let output = process.argv.length < 4
	? input
	: path.resolve(process.argv[3].trim());

input = path.resolve(input)

if(fs.lstatSync(input).isFile()){
	compressImage(input, output);
}else if(fs.lstatSync(input).isDirectory()){

	if(!fs.existsSync(output)){
		fs.mkdirSync(output);
	}

	compressDirectoryImages(input, output);

}else{
	console.log('Input is not exists'.red);
}

