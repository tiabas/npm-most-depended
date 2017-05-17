'use strict'

const BPromise = require("bluebird");
const urljoin = require('url-join');
const http = require('http');
const path = require('path');
const fs = BPromise.promisifyAll(require('fs'));
const rimraf = require('rimraf');

const utils = require("./lib/utils");
const NPMScrapper = require("./lib/scrapper");
const TEMP_PATH = `${path.dirname(__filename)}/temp`
const PACKAGES_PATH = `${path.dirname(__filename)}/packages`

// Get package details from Registry
// Download Package
// Extract to final destination
function processPackage(pkg) {
  return pkg.getRegistryDetails()
    .then((packageInfoJSON) => {
      let distInfo = utils.extractPackageDistInfo(packageInfoJSON),
      distShasum = distInfo['shasum'],
      distTarball = distInfo['tarball'];

      // download Tarball based in DistInfo
      return utils.downloadPackageTarball(distTarball, distShasum, TEMP_PATH);
    })
    .then((downloadPath) => {
      // extract tarball to packages directory
      let extractionPath = `${TEMP_PATH}/${pkg.name}`;
      return utils.extractTarball(downloadPath, extractionPath)
    })
    .then((extractionPath) => {
        let packageFinalDest = `${PACKAGES_PATH}/${pkg.name}`
        return new Promise((resolve, reject) => {
          fs.rename(`${extractionPath}/package`, packageFinalDest, (err) => {
            if (err) {
              reject(err);
            }
            else {
              // packages sucessfully downloaded and extracted
              console.log(`${pkg.name} extracted to ${extractionPath}`);
              resolve(packageFinalDest);
            }
        });
        });
    });
}

// Takes a count and download
module.exports = downloadPackages
function downloadPackages(count, callback) {
  let scrapper = new NPMScrapper()
  , packagesProcessed = 0
  , currentOffset = 0
  , pendingJobs = [];

  scrapper.fetchDependenciesAtOffest(currentOffset)
  .then((deps) => {

    for(let i = 0; i < (deps.length - 1) && i < count; i++) {
      pendingJobs.push(processPackage(deps[i]));
    }
    // increment offset in case we need to retrive new page
    currentOffset += deps.length;
    return Promise.all(pendingJobs);
  })
  .then((dirs) => {
    // clean up temp
    console.log(dirs);
    return new Promise((resolve, reject) => {
      rimraf(`${TEMP_PATH}/*`, () => {
        resolve();
      });
    });
  })
  .then(() => {
     callback();
  })
  .catch((err) => {
    console.log(err);
  })
}