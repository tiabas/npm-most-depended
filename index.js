'use strict'

const Promise = require("bluebird");
const urljoin = require('url-join');
const http = require('http');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));

const utils = require("./lib/utils");
const NPMScrapper = require("./lib/scrapper");
const TMP_PATH = `${path.dirname(__filename)}/tmp`
const PACKAGES_PATH = `${path.dirname(__filename)}/packages`


// Takes a count and download
module.exports = downloadPackages
function downloadPackages(count, callback) {
  let packagesDownloaded = 0
  let packagesExtracted = 0
  let scrapper = new NPMScrapper()
  let currentOffset = 0

  scrapper.fetchDependenciesAtOffest(currentOffset).then((deps) => {
    for(let i=0; i < deps.length; i++) {
      let dep = deps[i]

      if (packagesDownloaded >= count) {
        break;
      }

      // Get package details from Registry
      dep.getRegistryDetails()
      .then((packageInfoJSON) => {
        let distInfo = utils.extractPackageDistInfo(packageInfoJSON),
        distShasum = distInfo['shasum'],
        distTarball = distInfo['tarball'];

        // Download Tarball based in DistInfo
        return util.downloadPackageTarball(distTarball, distShasum, TMP_PATH);
      })
      .then((downloadPath) => {
        // Extract tarball to packages directory
        let extractionPath = `${TMP_PATH}/${dep.name}`;
        return utils.extractTarball(downloadPath, extractionPath)
          .then((extractionPath) => {
            console.log(`${dep.name} successfully extracted to ${extractionPath}`);

            return new Promise(function(resolve, reject) {
              let packageDir = `${PACKAGES_PATH}/${dep.name}`
              fs.rename(`${extractionPath}/package`, packageDir, function (err) {
                if (err) reject(err);
                else resolve(packageDir);
              });
            });
          });
      })
      .then((packageDir) => {
        // Package succefully downloaded and extracted. Update our status
        packagesExtracted += 1;
        if (packagesExtracted >= count) {
          console.log(`${packagesExtracted} packages downloaded and extracted`);
          // We're done, return to caller
          callback();
        }
      })
      .catch((err) => {
        console.log(err);
      });

      packagesDownloaded += 1
    }
    currentOffset += deps.length;
  })
  .catch((err) => {
      console.log(err);
  });
}
