import fs from 'fs';
import * as AWS from 'ibm-cos-sdk';
import uuidV4 from 'uuid';
import multipart from 'connect-multiparty';
import path from 'path';
import { getConfig } from '../../config/config';
import request from 'request'

const osTempDir = require('os').tmpdir();
const tempDir = osTempDir + '/uploads';
//console.log(tempDir)

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const config = getConfig(process.env.NODE_ENV);
const multipartMiddleware = multipart({uploadDir: tempDir});
let conf = config.cos.credentials;
let s3;
let bucketName = config.cos.bucketName;

const checkTempFolder = (req, res, next)=>{
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  next();
};

const prepareTempFolder = () => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  clearFolder(tempDir);
};

const clearFolder = (tempDir) => {
  fs.readdir(tempDir, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) {
          console.log(file, err);
        }
      });
    }
  });
};

const getFileExtension = (filename) => {
  let ext = /^.+\.([^.]+)$/.exec(filename);
  return ext === null ? '' : ext[1];
};

const checkMainBucket = () => {
  s3 = new AWS.S3(conf);
  const bucketParams = {
    Bucket: bucketName
  };
  return s3.headBucket(bucketParams).promise();
};
const createItemObject = (fileName, file) => {
  //console.log(fileName, file, 'fileName, file')
  const params = {
    Bucket: bucketName,
    Key: fileName,
    ACL: 'public-read',
    Body: file
  };
  return s3.putObject(params).promise();
};

const deleteItemObject = (key) => {
  return s3.deleteObject({
    Bucket: bucketName,
    Key: key
  }).promise();
};

const create = (filePath) => {
  return new Promise((resolve, reject) => {
    let file = fs.createReadStream(filePath);
    file.on('error', (err) => {
      console.log(err);
      fs.unlink(filePath);
      reject(FILE_MISSING);
    });
    checkMainBucket().then(() => {
      let fileExtension = getFileExtension(filePath);
      let fileName = fileExtension === '' ? uuidV4() : uuidV4() + '.' + fileExtension;
      createItemObject(fileName, file).then(() => {
        fs.unlink(filePath);
        resolve(fileName);
      }).catch(err => {
        console.log(err);
        fs.unlink(filePath);
        reject(err);
      });
    }).catch(err => {
      console.log('Bucket is not exists or you dont have permission to access it.');
      console.log(err);
      fs.unlink(filePath);
      reject(err);
    });
  });
};
const createByName = (filePath, fileName) => {
  return new Promise((resolve, reject) => {
    let file = fs.createReadStream(filePath);
    file.on('error', (err) => {
      console.log(err);
      fs.unlink(filePath);
      reject('Lỗi');
    });
    checkMainBucket().then(() => {
      createItemObject(fileName, file).then((response) => {
        fs.unlink(filePath);
        resolve(fileName);
      }).catch(err => {
        console.log(err);
        fs.unlink(filePath);
        reject(err);
      });
    }).catch(err => {
      console.log('Bucket is not exists or you dont have permission to access it.');
      console.log(err);
      fs.unlink(filePath);
      reject(err);
    });
  });
};

const update = (filePath, fileName) => {
  return new Promise((resolve, reject) => {
    let file = fs.createReadStream(filePath);
    file.on('error', (err) => {
      console.log(err);
      fs.unlink(filePath);
      reject('Lỗi');
    });
    checkMainBucket().then(async () => {
      await deleteItemObject(fileName).then(() => {
        console.log('Delete file: ' + fileName);
      }).catch(err => {
        console.log(err);
      });
      createItemObject(fileName, file).then(() => {
        fs.unlink(filePath);
        resolve(fileName);
      }).catch(err => {
        console.log(err);
        fs.unlink(filePath);
        reject(err);
      });
    }).catch(err => {
      console.log('Bucket is not exists or you dont have permission to access it.');
      console.log(err);
      fs.unlink(filePath);
      reject(err);
    });
  });
};

const remove = (fileName) => {
  return new Promise((resolve, reject) => {
    checkMainBucket().then(() => {
      deleteItemObject(fileName).then(() => {
        resolve(fileName);
      }).catch(err => {
        console.log(err);
        reject(err);
      });
    }).catch(err => {
      console.log('Bucket is not exists or you dont have permission to access it.');
      console.log(err);
      reject(err);
    });
  });
};
const getUrlFile = (fileName) => {
  //console.log(conf.endpoint + '/' + bucketName + '/' + fileName, 'conf.endpoint + \'/\' + bucketName + \'/\' + fileName;')
  return conf.endpoint + '/' + bucketName + '/' + fileName;
};

function getFileName(path) {
  let fileName;
  if (path) {
    let fileExtension = getFileExtension(path);
    fileName = fileExtension === '' ? uuidV4() : uuidV4() + '.' + fileExtension;
  }
  return fileName;
}

async function downLoadAndSaveFile(pathUrl, file_name, fileStorage) {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  request(pathUrl).pipe(fs.createWriteStream(tempDir + '/' + file_name)).on('close', async function () {
     await createByName(tempDir + '/' + file_name, fileStorage)
  });
}

export {
  create,
  createByName,
  update,
  remove,
  getUrlFile,
  multipartMiddleware,
  getFileExtension,
  prepareTempFolder,
  getFileName,
  checkTempFolder,
  checkMainBucket,
  createItemObject,
  downLoadAndSaveFile
};