"use strict";

const Promise = require("bluebird");
const urljoin = require('url-join');
const NPMRegistryURL = 'http://registry.npmjs.org';
const request = require('request-promise');

class NPMPackage {

  static npmPackageFromDOMElement(packageEl) {
    var name = packageEl.querySelector("h3 > a.name").textContent;
    var description = packageEl.querySelector("p.description").textContent;
    var version = packageEl.querySelector("p.author > a.version").textContent;
    return new NPMPackage(name, description, version);
  }

  constructor(name, description, version) {
    this.name = name;
    this.description = version;
    this.version = version;
  }

  // Get NPM package details given package name
  getRegistryDetails() {
    let detailsURL = urljoin(NPMRegistryURL, `/${this.name}`);
    return request(detailsURL)
           .then((body) => {
             return JSON.parse(body);
           })
           .catch((err) => {
             return Promise.reject(err);
           });
  }

  toString() {
      return `${this.name} | ${this.version}`
  }

  print() {
      console.log(this.toString());
  }

  downloadPath() {
      return `${this.name}/-/${this.name}-${this.version}.tgz`
  }
}
module.exports = NPMPackage;
