"use strict";

const urljoin = require('url-join');
const request = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Promise = require("bluebird");
const NPMPackage = require("./package");
const NPMJS_HOST_URL = "https://www.npmjs.com/browse/depended";

class NPMScrapper {
  constructor(host_url) {
    this.host_url = NPMJS_HOST_URL;
  }

  // Extract Nodes for Packages
  extractPackageElements(html, callback) {
    let pageDOM = new JSDOM(html);
    let document = pageDOM.window.document;
    let packageElements = document.getElementsByClassName("package-details");
    let packageObjects = []

    for (let i = 0; i < packageElements.length; i++) {
      let packageObj = NPMPackage.npmPackageFromDOMElement(packageElements[i]);
      packageObjects.push(packageObj);
    }
    return packageObjects
  };

  // Fetch Dependencies at Offest
  fetchDependenciesAtOffest (offset, callback) {
    let urlToFetch = urljoin(this.host_url, `?offset=${offset}`);
    let self = this;

    return new Promise(function(resolve, reject) {
      request(urlToFetch)
      .then((body) => {
          let packageObjects = self.extractPackageElements(body);
          resolve(packageObjects);
      });
    });
  };

  toString() {
    return `${this.host_url}`
  }

  print() {
    console.log( this.toString() );
  }
}

module.exports = NPMScrapper;
