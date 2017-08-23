//scan every separate flat of an source
const CLI_READER = 1;
const HTTP_READER = 2;
const FILE_READER = 3;
const fs = require('fs');

function FileReader(path){
  this.path = path;
}
FileReader.prototype.readLine = function (callback) {
  fs.readFile(this.path, 'utf8', (err, data)=>{
		if(err){
			callback(null, err);
		}
    else{
      callback();
    }
	});
};

function HttpReader(path){

}

HttpReader.prototype.readLine = function () {

};

function CliReader(path){

}

CliReader.prototype.readLine = function () {

};
moudle.exports = {
  create:function(path, type){
    switch(type){
      case CLI_READER:
        return new CliReader(path);
      case HTTP_READER:
        return new HttpReader(path);
      case FILE_READER:
        return new FileReader(path);
      default:
        console.log("unknown path type");
        return null;

    }
  },
  CLI_READER : CLI_READER,
  HTTP_READER : HTTP_READER,
  FILE_READER : FILE_READER
}
