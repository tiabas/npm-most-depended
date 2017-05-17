const fs = require('fs')
const request = require('request-promise')
const expect = require('chai').expect
const NPMScrapper = require('../lib/scrapper')
const NPMPackage = require("../package");

describe('NPMPackage', () => {
  describe('#extractPackageElements()', () => {
    it('should return a list of package objects', function() {
      let scrapper = new NPMScrapper();
      let html = `
        <html>
          <body>
          <ul>
            <li>
              <div class="package-widget ">
                <div class="package-details">
                  <h3>
                  <a class="name" href="/package/object-assign">object-assign</a>
                </h3>
                  <p class="description">ES2015 &#x60;Object.assign()&#x60; ponyfill</p>
                  <p class="author quiet">
                    <a class="version" href="/package/object-assign">4.1.1</a>
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div class="package-widget ">
                <div class="package-details">
                  <h3>
                  <a class="name" href="/package/semver">semver</a>
                </h3>
                  <p class="description">The semantic version parser used by npm.</p>
                  <p class="author quiet">
                    <a class="version" href="/package/semver">5.3.0</a>
                  </p>
                </div>
              </div>
            </li>
          </ul>
          </body>
        </html>`;
      packages = scrapper.extractPackageElements(html);
      expect(packages.length).to.equal(2);
      expect(packages[0]).to.be.an.instanceof(NPMPackage.constructor);
    });
  });

  describe('#fetchDependenciesAtOffest()', () => {
    it('should make url request and return packages', function() {
      // Not Implemented
      // Trouble Figuring out how to stub promises
    });
  });
});