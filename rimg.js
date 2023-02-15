require('colors');

let fs = require('fs');
let axios = require('axios');
let FormData = require('form-data');
let path = require('path');
let crypto = require('crypto');

function sha1(s){
	return crypto.createHash('sha1')
	.update(s)
	.digest('hex');
}

async function updateImage(from){

	let form = new FormData;
	let file = fs.readFileSync(from);

	let id = sha1(
		Math.random().toString()
	);

	let session = Math.random() * 1000000;

	let ext = path.extname(from);

	form.append('file', file, id + ext);
	form.append('session', session);

	let response = await axios.post('https://coding.tools/exif-remover', form);

	if(typeof response.data === 'object' && ('download_file_path' in response.data)){
		return response.data.download_file_path;
	}

	throw 'Cant upload file';

}

async function exifRemoveImage(from, to){

	try {

		let image = await updateImage(from);

		let stream = await axios.get(image, {
			responseType: "stream"
		});

		await stream.data.pipe(
			fs.createWriteStream(to)
		);

		console.log('Exif removed:'.green, from.blue, to.cyan);

	}catch (e){
		console.log('Error:'.red, from.blue);
	}

	return false;

}

async function exifRemoveDirectoryImages(from, to){

	fs.readdirSync(from).forEach(file => {

		let target_from = path.resolve(from, file),
			target_to = path.resolve(to, file);

		if(fs.lstatSync(target_from).isDirectory()){

			if(!fs.existsSync(target_to)){
				fs.mkdirSync(target_to);
			}

			return exifRemoveDirectoryImages(target_from, target_to);

		}else{

			let ext = path.extname(target_from);

			switch(ext){

				case '.jpeg':
				case '.jpg':
				case '.png':
				case '.gif':
					return exifRemoveImage(target_from, target_to);

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
	exifRemoveImage(input, output);
}else if(fs.lstatSync(input).isDirectory()){

	if(!fs.existsSync(output)){
		fs.mkdirSync(output);
	}

	exifRemoveDirectoryImages(input, output);

}else{
	console.log('Input is not exists'.red);
}

