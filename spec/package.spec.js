const fs = require('fs')
const expect = require('chai').expect
const sinon = require('sinon')

const NPMPackage = require('../lib/package')


describe('NPMPackage', () => {
  let request;

  before(() => {
    request = sinon.stub();
  });

  describe('#detailsURL', () => {
    it('should return details url', () => {
      let pkg = new NPMPackage('test', 'it works!', '0.01');
      let url = pkg.detailsURL;
      expect(url).to.equal(`http://registry.npmjs.org/test`);
    });
  });

  describe('#toString()', () => {
    it('should return string representation', () => {
      let pkg = new NPMPackage('test', 'it works!', '0.01');
      let s = pkg.toString();
      expect(s).to.equal('test | 0.01');
    });
  });

  describe('#getRegistryDetails()', () => {
      // Not Implemented
  });
});
