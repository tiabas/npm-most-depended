"use strict";

const crypto = require('crypto');
const fs = require('fs');
const request = require('request-promise');
const Promise = require("bluebird");
const tar = require('tar');

module.exports.checksum = function (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}

// Download File from URL
module.exports.downloadURLToFile = function (uri, destPath) {
  return new Promise(function(resolve, reject) {
    request({
        method: "GET",
        uri: uri,
        encoding: null
    })
    .then((body) => {
      fs.writeFile(destPath, body, function(err) {
        if (err) {
          reject(err);
        }
        else {
          resolve(destPath);
        }
      });
    });
  });
}

// Extracts Dist info from PackageJSON
module.exports.extractPackageDistInfo = function (packageJSON) {
  let lastestVersion = packageJSON['dist-tags']['latest'],
      versionInfo = packageJSON['versions'][lastestVersion],
      distInfo = versionInfo['dist'];
  return distInfo;
}


module.exports.extractTarball = function (tarPath, dstDir) {
  return fs.mkdirAsync(dstDir)
    .then(_ => {
      return new Promise(function(resolve, reject) {
        // extract to destination
        tar.extract({
            file: tarPath,
            cwd: dstDir,
        })
        .then(_ => {
          resolve(dstDir);
      });
    });
  });
}

// Downloads package tarball and saves to temp
module.exports.downloadPackageTarball = function (tarURL, shaSum, destDir) {
  let urlTokens = tarURL.split('/');
  let destName = urlTokens[urlTokens.length-1];
  let destPath = `${destDir}/${destName}`;

  return utils.downloadURLToFile(tarURL, destPath)
    .then((filePath) => {
      // Verify Checksum of Downloaded File
     return new Promise(function(resolve, reject) {
       fs.readFileAsync(filePath).then((data) => {
         if (utils.checksum(data, 'sha1') != shaSum) {
           reject(new Error('download data corrupt'));
         }
         resolve(destPath);
       })
       .catch((err) => {
         reject(err);
       })
     });
    });
}
