const { _getRssFeed, _formatAndPrintLogOutput } = require('../index');
const sinon = require('sinon');
const { expect } = require('chai');

describe('GitHub Blog RSS Feed Action', () => {
  describe('_getRssFeed', () => {
    it('should fetch and parse RSS feed', async () => {
      const url = 'https://github.blog/feed/?s=actions';
      const label = 'actions';
      const feed = await _getRssFeed(url, label);
      expect(feed).to.have.property('items');
      expect(feed.items).to.be.an('array');
    });
  });

  describe('_formatAndPrintLogOutput', () => {
    it('should format and print log output', async () => {
      const feed = {
        items: [
          {
            title: 'Test Title',
            link: 'https://example.com',
            pubDate: '2023-01-01'
          }
        ]
      };
      const consoleLogStub = sinon.stub(console, 'log');
      await _formatAndPrintLogOutput(feed);
      expect(consoleLogStub.calledWith('---')).to.be.true;
      expect(consoleLogStub.calledWith('Title: Test Title')).to.be.true;
      expect(consoleLogStub.calledWith('Link: https://example.com')).to.be.true;
      expect(consoleLogStub.calledWith('PubDate: 2023-01-01')).to.be.true;
      consoleLogStub.restore();
    });
  });
});
