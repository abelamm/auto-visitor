#!/usr/bin/env node

/**
 * Auto-Visitor CLI
 * Interactive command-line interface
 */

const AutoVisitor = require('./auto-visitor');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (question) => new Promise((resolve) => rl. question(question, resolve));

async function main() {
  console. log('\n🚀 AUTO-VISITOR');
  console.log('═'. repeat(60));
  console.log('Browser automation traffic tool\n');

  try {
    // Get target URL
    const url = await prompt('Enter target URL (e.g., https://example. com): ');
    if (!url || (! url.startsWith('http://') && !url.startsWith('https://'))) {
      console. error('❌ Invalid URL');
      process.exit(1);
    }

    // Get number of visits
    const visitsInput = await prompt('Number of visits (default 10): ');
    const visits = parseInt(visitsInput || '10');
    if (isNaN(visits) || visits < 1) {
      console.error('❌ Invalid visit count');
      process.exit(1);
    }

    // Ask about proxies
    const useCustomProxyInput = await prompt(
      'Use custom proxies?  (y/n, default n for auto free proxies): '
    );
    let useFreeProxies = true;
    let proxies = [];

    if (useCustomProxyInput. toLowerCase() === 'y') {
      const proxyFile = await prompt('Proxy file path (default proxies.txt): ') || 'proxies.txt';
      if (fs.existsSync(proxyFile)) {
        proxies = fs
          .readFileSync(proxyFile, 'utf-8')
          .split('\n')
          .map((p) => p.trim())
          .filter((p) => p && !p. startsWith('#'));
        console.log(`✓ Loaded ${proxies.length} proxies`);
        useFreeProxies = false;
      } else {
        console.log('⚠️  Proxy file not found, using free proxies instead');
      }
    } else {
      console.log('✓ Will auto-fetch free proxies');
    }

    // Ask about concurrency
    const concurrencyInput = await prompt('Concurrent browsers (default 3): ');
    const concurrency = parseInt(concurrencyInput || '3');

    rl.close();

    // Create visitor
    const visitor = new AutoVisitor({
      headless: true,
      concurrency,
      useFreeProxies,
      validateFreeProxies: true,
      proxyCount: 20,
      logLevel: 'info'
    });

    // Load custom proxies if provided
    if (proxies. length > 0) {
      visitor.proxies = proxies;
      await visitor.validateProxies();
    }

    // Run campaign
    await visitor.start(url, visits);
  } catch (error) {
    console.error(`❌ Error: ${error. message}`);
    rl.close();
    process. exit(1);
  }
}

main();