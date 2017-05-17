"use strict";

const urljoin = require('url-join');
const request = require('request-promise');
const NPMRegistryURL = 'http://registry.npmjs.org';

class NPMPackage {

  static npmPackageFromDOMElement(packageEl) {
    let name = packageEl.querySelector("h3 > a.name").textContent;
    let description = packageEl.querySelector("p.description").textContent;
    let version = packageEl.querySelector("p.author > a.version").textContent;
    return new NPMPackage(name, description, version);
  }

  constructor(name, description, version) {
    this.name = name;
    this.description = version;
    this.version = version;
  }

  // Generate Registry URL to get details for this package
  get detailsURL() {
    return urljoin(NPMRegistryURL, `/${this.name}`);
  }

  // Get NPM package details given package name
  getRegistryDetails() {
    let url = this.detailsURL
    return new Promise((resolve, reject) => {
      request(url)
      .then((body) => {
        try {
          let jsonData = JSON.parse(body);
          resolve(jsonData);
        }
        catch(err) {
          reject(err);
        }
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  toString() {
      return `${this.name} | ${this.version}`
  }

  print() {
      console.log(this.toString());
  }
}
module.exports = NPMPackage;
