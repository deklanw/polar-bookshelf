import { assert } from 'chai';
import { ProxyServerConfig } from './ProxyServerConfig';
import { CacheRegistry } from './CacheRegistry';
import { ProxyServer } from './ProxyServer';
import { BufferedCacheEntry } from './BufferedCacheEntry';
import { Http } from '../../util/Http';
const url = require('url');

const HttpProxyAgent = require('http-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');

xdescribe('ProxyServer', function() {
    let proxyServer: ProxyServer | undefined;
    let cacheRegistry: CacheRegistry | undefined;

    beforeEach(function(done) {
        console.log('Starting...');

        const proxyServerConfig = new ProxyServerConfig(8090);
        cacheRegistry = new CacheRegistry(proxyServerConfig);

        proxyServer = new ProxyServer(proxyServerConfig, cacheRegistry);
        proxyServer.start();

        console.log('Starting...done');

        // add requests to the cache registry

        cacheRegistry.register(
            new BufferedCacheEntry({
                url: 'http://foo.com/index.html',
                method: 'GET',
                headers: {
                    'Content-Type': 'text/html',
                },
                statusCode: 200,
                statusMessage: 'OK',
                data: 'this is our first cache entry',
            })
        );

        cacheRegistry.register(
            new BufferedCacheEntry({
                url: 'http://foo.com/second.html',
                method: 'GET',
                headers: {
                    'Content-Type': 'text/html',
                },
                statusCode: 200,
                statusMessage: 'OK',
                contentLength: 30,
                data: 'this is our second cache entry',
            })
        );

        done();
    });

    afterEach(function(done) {
        console.log('Stopping...');

        proxyServer!.stop();

        console.log('Stopping...done');

        done();
    });

    describe('proxying', function() {
        it('basic', function() {
            // this is just basic startup and teardown.
        });

        it('Proxy HTTP requests', async function() {
            const agent = new HttpProxyAgent('http://localhost:8090');

            const link = 'http://httpbin.org/get?message=hello+world';
            // let link = "http://example.com";

            const content = await testWithAgent(link, agent);
            assert.equal(content.toString().indexOf('hello world') > -1, true);
        });

        it('Proxy HTTPS requests', async function() {
            const agent = new HttpsProxyAgent('http://localhost:8090');

            const link = 'https://httpbin.org/get?message=hello+world';

            const content = await testWithAgent(link, agent);
            assert.equal(content.toString().indexOf('hello world') > -1, true);
        });
    });

    describe('caching', function() {
        it('hasEntry', async function() {
            const link = 'http://foo.com/index.html';
            assert.equal(cacheRegistry!.hasEntry(link), true);
        });

        it('basic', async function() {
            const agent = new HttpProxyAgent('http://localhost:8090');

            const link = 'http://foo.com/index.html';

            const executed = await executeWithAgent(link, agent);
            assert.equal(
                executed.data.toString(),
                'this is our first cache entry'
            );
            assert.equal(executed.response.headers['x-polar-cache'], 'hit');
        });

        it('second request with content-length', async function() {
            const agent = new HttpProxyAgent('http://localhost:8090');

            const link = 'http://foo.com/second.html';

            const executed = await executeWithAgent(link, agent);
            assert.equal(
                executed.data.toString(),
                'this is our second cache entry'
            );
            assert.equal(executed.response.headers['x-polar-cache'], 'hit');
            assert.equal(executed.response.headers['content-length'], '30');
        });
    });
});

async function testWithAgent(link: string, agent: string) {
    const options = url.parse(link);
    options.method = 'GET';
    options.agent = agent;

    // console.log("options: ", options);

    const content = await Http.fetchContent(options);
    return content.toString();
}

async function executeWithAgent(link: string, agent: string) {
    const options = url.parse(link);
    options.method = 'GET';
    options.agent = agent;

    // console.log("options: ", options);

    return await Http.execute(options);
}
