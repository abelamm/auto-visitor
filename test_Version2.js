/**
 * Auto-Visitor Test Suite
 */

const AutoVisitor = require('./auto-visitor');
const assert = require('assert');

class TestSuite {
  constructor() {
    this.passed = 0;
    this. failed = 0;
  }

  async testConfiguration() {
    console.log('TEST 1: Configuration');
    try {
      const visitor = new AutoVisitor({
        concurrency: 5,
        timeout: 40000,
        minVisitTime: 10000
      });

      assert.strictEqual(visitor.config.concurrency, 5);
      assert.strictEqual(visitor. config.timeout, 40000);
      assert.strictEqual(visitor.config.minVisitTime, 10000);

      console. log('  ✓ PASSED\n');
      this.passed++;
    } catch (e) {
      console.log(`  ✗ FAILED: ${e.message}\n`);
      this.failed++;
    }
  }

  async testErrorCategorization() {
    console.log('TEST 2: Error Categorization');
    try {
      const visitor = new AutoVisitor();

      const tests = [
        { error: new Error('timeout'), expected: 'TIMEOUT' },
        { error: new Error('connection failed'), expected: 'CONNECTION_ERROR' },
        { error: new Error('proxy error'), expected: 'PROXY_ERROR' }
      ];

      tests.forEach(({ error, expected }) => {
        const result = visitor.categorizeError(error);
        assert.strictEqual(result, expected);
      });

      console.log('  ✓ PASSED\n');
      this.passed++;
    } catch (e) {
      console.log(`  ✗ FAILED: ${e.message}\n`);
      this.failed++;
    }
  }

  async testProxyRotation() {
    console.log('TEST 3: Proxy Rotation');
    try {
      const visitor = new AutoVisitor();
      const proxies = ['http://proxy1:8080', 'http://proxy2:8080', 'http://proxy3:8080'];
      visitor.proxies = proxies;

      const selected = [];
      for (let i = 0; i < 6; i++) {
        selected. push(visitor.getNextProxy());
      }

      assert.strictEqual(selected[0], proxies[0]);
      assert. strictEqual(selected[3], proxies[0]); // Cycle

      console.log('  ✓ PASSED\n');
      this.passed++;
    } catch (e) {
      console.log(`  ✗ FAILED: ${e.message}\n`);
      this.failed++;
    }
  }

  async testUserAgents() {
    console.log('TEST 4: User Agent Randomization');
    try {
      const visitor = new AutoVisitor();

      const agents = new Set();
      for (let i = 0; i < 20; i++) {
        agents.add(visitor.getRandomUserAgent());
      }

      assert(agents.size > 1);
      console.log(`  Generated ${agents.size} unique agents`);
      console.log('  ✓ PASSED\n');
      this.passed++;
    } catch (e) {
      console.log(`  ✗ FAILED: ${e.message}\n`);
      this.failed++;
    }
  }

  async testSleep() {
    console.log('TEST 5: Sleep Function');
    try {
      const visitor = new AutoVisitor();
      const start = Date.now();
      await visitor.sleep(100, 200);
      const duration = Date. now() - start;

      assert(duration >= 100 && duration <= 300);
      console.log(`  Sleep took ${duration}ms`);
      console.log('  ✓ PASSED\n');
      this.passed++;
    } catch (e) {
      console. log(`  ✗ FAILED: ${e.message}\n`);
      this.failed++;
    }
  }

  async runAll() {
    console.log('\n🧪 TEST SUITE');
    console.log('═'. repeat(60) + '\n');

    await this.testConfiguration();
    await this.testErrorCategorization();
    await this.testProxyRotation();
    await this.testUserAgents();
    await this.testSleep();

    console.log('═'.repeat(60));
    console.log(`✓ Passed: ${this.passed}`);
    console.log(`✗ Failed: ${this.failed}`);
    console.log(`Total: ${this.passed + this. failed}`);
    console.log('═'.repeat(60) + '\n');

    return this.failed === 0;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const suite = new TestSuite();
  suite.runAll().then((success) => {
    process. exit(success ? 0 : 1);
  });
}

module.exports = TestSuite;