require('colors');

let fs = require('fs');
let axios = require('axios');
let FormData = require('form-data');
let path = require('path');
let crypto = require('crypto');

function sha1(s){

	return crypto
		.createHash('sha1')
		.update(s)
		.digest('hex');

}

async function sleep(time){

	return new Promise(r => {
		setTimeout(r, time)
	});

}

async function updateImage(from){

	let form = new FormData;
	let file = fs.readFileSync(from);

	let id = sha1(
		Math.random().toString()
	);

	let ext = path.extname(from);

	form.append('file', file, id + ext);
	form.append('id', 'file_' + id);
	form.append('name', id + ext);
	form.append('rnd', Math.random());

	let response = await axios.post('https://imagecompressor.com/upload/gm019o41kgi4haq1', form, {
		timeout : 20000
	});

	if(typeof response.data === 'object' && ('image' in response.data)){
		return response.data.image;
	}

	throw 'Cant upload file';

}

async function registerImage(fid){
	return axios.get('https://imagecompressor.com/auto/gm019o41kgi4haq1/' + fid + '?quality=100&rnd=' + Math.random());
}

async function getImageInfo(fid){

	let response = await axios.get('https://imagecompressor.com/status/gm019o41kgi4haq1/' + fid + '?rnd=' + Math.random());

	if(typeof response.data === 'object' && ('status' in response.data)){
		return response.data;
	}

	throw 'Cant get status';

}

async function compressImage(from, to){

	try {

		let image = await updateImage(from);

		await registerImage(image.fid);

		while (true) {

			await sleep(500);

			let info = await getImageInfo(image.fid);

			if (info.status === 'success') {

				console.log('Compressed:'.green, from.blue, to.cyan, info.savings);

				let stream = await axios.get('https://imagecompressor.com' + info.optimized_url, {
					responseType: "stream"
				});

				await stream.data.pipe(
					fs.createWriteStream(to)
				);

				return true;

			} else if(info.status !== 'processing') {
				throw 'Error';
			}

		}

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

