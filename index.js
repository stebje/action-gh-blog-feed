const core = require('@actions/core');
const github = require('@actions/github');
const Parser = require('rss-parser');

async function run() {
  try {
    const token = core.getInput('token');
    const dryRun = core.getBooleanInput('dry-run');
    const labels = core.getMultilineInput('labels');

    const baseUrl = 'https://github.blog/feed/?s=';
    const octokit = github.getOctokit(token);

    const allFeeds = [];
    
    for (const label of labels) {
      const feed = await _getRssFeed(baseUrl, label);

      feed.items.forEach(item => {
        allFeeds.push(item);
      });

      await _formatAndPrintLogOutput(feed);
    }

    // TODO: Create an issue in the workflow repo listing all rss feed items with their hyperlink, publication date, and title. Label the issue as "news-update".
    if (!dryRun) {
      const issueBody = allFeeds.map(item => `- [${item.title}](${item.link})`).join('\n');
      const issue = await octokit.rest.issues.create({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      title: 'News Update',
      body: issueBody,
      labels: ['news-update']
      });
    }

    core.setOutput('feeds', JSON.stringify(allFeeds));

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function _getRssFeed(url, label) {
  const rssFeedUrl = `${url}${label}`;
  core.info(`Getting RSS feed for ${rssFeedUrl}...`)
  const parser = new Parser();
  const feed = await parser.parseURL(rssFeedUrl);

  return feed;
}

/**
 * Formats and prints the log output for the given feed.
 * @param {Object} feed - The feed object.
 * @returns {Promise<void>} - A promise that resolves when the log output is printed.
 */
async function _formatAndPrintLogOutput(feed) {
  feed.items.forEach(item => {
    console.log('---');
    console.log(`Title: ${item.title}`);
    console.log(`Link: ${item.link}`);
    console.log(`PubDate: ${item.pubDate}`);
  });
}

const TEST = 3

module.exports = {
  _getRssFeed,
  _formatAndPrintLogOutput
};

run();
