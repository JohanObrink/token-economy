var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  sinonPromise = require('sinon-promise'),
  proxyquire = require('proxyquire');

sinonPromise(sinon);
chai.use(require('sinon-chai'));

describe('models/Economy', function () {
  var Economy, hashid, db;

  beforeEach(function () {
    hashid = {
      decodeHex: sinon.stub()
    };
    db = {
      economies: {
        find: sinon.promise()
      },
      tokens: {
        find: sinon.promise()
      }
    };
    Economy = proxyquire(process.cwd() + '/lib/models/economy', {
      '../services/hashid': hashid,
      '../services/mongo': db
    });
  });

  describe('constructor', function () {
    it('can be instantiated empty', function () {
      var economy = new Economy();
      expect(economy).to.be.instanceof(Economy);
    });
    it('can be instantiated with data', function () {
      var economy = new Economy({foo:'bar'});
      expect(economy).to.be.instanceof(Economy);
      expect(economy.foo).to.equal('bar');
    });
  });

  describe('Economy.get', function () {
    it('decodes the hashid', function () {
      Economy.get('abc123');
      expect(hashid.decodeHex).calledOnce.calledWith('abc123');
    });
    it('calls mongo with the correct query for economies', function () {
      var id = 'abc123';
      var hid = 'cde987';
      hashid.decodeHex.withArgs(hid).returns(id);
      Economy.get(hid);
      expect(db.economies.find).calledOnce.calledWith({'_id': id});
    });
    describe('found economy', function () {
      var success, fail, economyResult;
      beforeEach(function () {
        success = sinon.spy();
        fail = sinon.spy();
        hashid.decodeHex.returns('cde987');
        economyResult = {
          _id: 'cde987',
          template: {},
          rewards: {}
        };
        db.economies.find.resolves([economyResult]);
        Economy.get('abc123').then(success).catch(fail);
      });
      it('calls db.tokens.find with correct economy_id', function () {
        expect(db.tokens.find).calledOnce.calledWith({'economy_id': 'cde987'});
      });
      it('returns an Economy with the correct data when the tokens promise resolves', function () {
        var tokens = [
          {number: 2, days: []}
        ];
        var expected = new Economy(economyResult);
        expected.tokens = tokens;

        db.tokens.find.resolve(tokens);

        expect(fail).not.called;
        expect(success).calledOnce.calledWith(expected);
      });
      it('returns an Economy with the correct data when the tokens promise rejects', function () {
        var expected = new Economy(economyResult);

        db.tokens.find.reject();

        expect(fail).not.called;
        expect(success).calledOnce.calledWith(expected);
      });
    });
  });
});