'use strict';

const urljoin = require('url-join');
const request = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const NPMPackage = require("./package");
const NPMJS_HOST_URL = "https://www.npmjs.com/browse/depended";

class NPMScrapper {
  constructor(host_url) {
    this.host_url = host_url || NPMJS_HOST_URL;
  }

  // Extracts DOM nodes relating to NPM Packages
  extractPackageElements(html) {
    let pageDOM = new JSDOM(html);
    let document = pageDOM.window.document;
    let packageElements = document.getElementsByClassName("package-details");
    let packageObjects = []
    // can't use `array.map` and collection so, forLoop goodness
    for (let i = 0; i < packageElements.length; i++) {
      let packageObj = NPMPackage.npmPackageFromDOMElement(packageElements[i]);
      packageObjects.push(packageObj);
    }
    return packageObjects
  };

  // Fetches Dependencies at offest
  fetchDependenciesAtOffest(offset) {
    let urlToFetch = urljoin(this.host_url, `?offset=${offset}`);
    let self = this;
    return new Promise((resolve, reject) => {
      request(urlToFetch)
        .then((body) => {
          resolve(self.extractPackageElements(body));
        });
    });
  };

  toString() {
    return `${this.host_url}`
  }

  print() {
    console.log(this.toString());
  }
}

module.exports = NPMScrapper;
