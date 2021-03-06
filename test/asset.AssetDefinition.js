var expect = require('chai').expect

var cclib = require('coloredcoinjs-lib')

var AssetDefinition = require('../src/asset').AssetDefinition
var storage = require('../src/storage')


describe('asset.AssetDefinition', function() {
  var cdStorage, cdManager, assetdef
  var bitcoinData = {
    monikers: ['bitcoin'],
    colorSchemes: [''],
    unit: 100000000
  }

  beforeEach(function() {
    cdStorage = new cclib.storage.ColorDefinitionStorage()
    cdManager = new cclib.color.ColorDefinitionManager(cdStorage)
    assetdef = new AssetDefinition(cdManager, bitcoinData)
    cdStorage.clear()
  })

  it('constructor throw error', function() {
    var data = {
      monikers: ['bitcoin'],
      colorSchemes: [''],
      unit: 2
    }
    var fn = function() { new AssetDefinition(cdManager, data) }
    expect(fn).to.throw(Error)
  })

  it('getId', function() {
    expect(assetdef.getId()).to.equal('JNu4AFCBNmTE1')
  })

  it('getMonikers', function() {
    expect(assetdef.getMonikers()).to.deep.equal(['bitcoin'])
  })

  it('getColorSet', function() {
    expect(assetdef.getColorSet()).to.be.instanceof(cclib.color.ColorSet)
  })

  describe('parseValue', function() {
    var fixtures = [
      { description: 'return NaN', value: 'a.00', expect: NaN },
      { description: '0 satoshi', value: '0.00000000', expect: 0 },
      { description: '1 satoshi', value: '0.00000001', expect: 1 },
      { description: '1 btc minus 1 satoshi', value: '0.99999999', expect: 99999999 },
      { description: '1 btc', value: '1.00000000', expect: 100000000 },
      { description: '1 btc plus 1 satoshi', value: '1.00000001', expect: 100000001 },
      { description: '5 btc plus 345 mbtc', value: '5.34500000', expect: 534500000 }
    ]

    fixtures.forEach(function(fixture) {
      it(fixture.description, function() {
        expect(assetdef.parseValue(fixture.value)).to.deep.equal(fixture.expect)
      })
    })
  })

  describe('formatValue', function() {
    var fixtures = [
      { description: '0 satoshi', value: 0, expect: '0.00000000' },
      { description: '1 satoshi', value: 1, expect: '0.00000001' },
      { description: '1 btc minus 1 satoshi', value: 99999999, expect: '0.99999999' },
      { description: '1 btc', value: 100000000, expect: '1.00000000' },
      { description: '1 btc plus 1 satoshi', value: 100000001, expect: '1.00000001' },
      { description: '5 btc plus 345 mbtc', value: 534500000, expect: '5.34500000' }
    ]

    fixtures.forEach(function(fixture) {
      it(fixture.description, function() {
        expect(assetdef.formatValue(fixture.value)).to.deep.equal(fixture.expect)
      })
    })
  })

  it('getData', function() {
    expect(assetdef.getData()).to.deep.equal({
      monikers: ['bitcoin'],
      colorSchemes: [''],
      unit: 100000000
    })
  })
})
