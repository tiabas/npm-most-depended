"use strict";

const crypto = require('crypto');
const fs = require('fs');
const request = require('request-promise');
const tar = require('tar');

// Verifies the input string matches given checksum
function checksum(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}
module.exports.checksum = checksum

// Downloads File from URL
function downloadURLToFile(uri, destPath) {
  return new Promise((resolve, reject) => {
    request({
        method: "GET",
        uri: uri,
        encoding: null
    })
    .then((body) => {
      fs.writeFile(destPath, body, (err) => {
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
module.exports.downloadURLToFile = downloadURLToFile

// Extracts Dist info from PackageJSON
function extractPackageDistInfo(packageJSON) {
  let lastestVersion = packageJSON['dist-tags']['latest'],
      versionInfo = packageJSON['versions'][lastestVersion],
      distInfo = versionInfo['dist'];
  return distInfo;
}
module.exports.extractPackageDistInfo = extractPackageDistInfo


function extractTarball(tarPath, dstDir) {
  return fs.mkdirAsync(dstDir)
    .then(_ => {
      return new Promise((resolve, reject) => {
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
module.exports.extractTarball = extractTarball


// Downloads package tarball and saves to temp
function downloadPackageTarball(tarURL, shaSum, destDir) {
  let urlTokens = tarURL.split('/');
  let destName = urlTokens[urlTokens.length-1];
  let destPath = `${destDir}/${destName}`;

  return downloadURLToFile(tarURL, destPath)
    .then((filePath) => {
      // Verify Checksum of Downloaded File
     return new Promise(function(resolve, reject) {
       fs.readFileAsync(filePath).then((data) => {
         if (module.exports.checksum(data, 'sha1') != shaSum) {
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
module.exports.downloadPackageTarball = downloadPackageTarball
 