/**
 * Auto-Visitor Example Usage
 */

const AutoVisitor = require('./auto-visitor');

async function main() {
  // Create visitor with free proxies (default)
  const visitor = new AutoVisitor({
    headless: true,
    concurrency: 3,
    minVisitTime: 8000,
    maxVisitTime: 35000,
    timeout: 30000,
    retryAttempts: 2,
    useFreeProxies: true,      // Auto-load free proxies (DEFAULT)
    validateFreeProxies: true,
    proxyCount: 20,
    logLevel: 'info'
  });

  try {
    // Start campaign with 20 visits
    await visitor.start('https://example.com', 20);

    // Get statistics
    const stats = visitor. getStats();
    console.log('\nDetailed Statistics:');
    console. log(JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Fatal error:', error.message);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main };