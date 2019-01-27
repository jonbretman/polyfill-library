/* eslint-env mocha */
/* globals proclaim, AbortSignal */

it('is a function', function () {
	proclaim.isFunction(AbortSignal);
});

it('has correct arity', function () {
	proclaim.arity(AbortSignal, 0);
});

it('has correct name', function () {
	proclaim.hasName(AbortSignal, 'AbortSignal');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(window, 'AbortSignal');
});

describe('basic tests', function() {

  it('AbortSignal constructor', function() {
      const signal = new AbortSignal();
      proclaim.isFalse(signal.aborted);
      proclaim.isNull(signal.onabort);
  });

  it('Request is patched', function() {
      const controller = new AbortController();
      const signal = controller.signal;
      let request = new Request('/', {signal});
      proclaim.deepStrictEqual(request.signal, signal);
      proclaim.isTrue(Request.prototype.isPrototypeOf(request));
  });

  it('abort during fetch', (done) => {
      setTimeout(function() {
        done({name: 'fail'});
      }, 2000);
      const controller = new AbortController();
      const signal = controller.signal;
      setTimeout(function() {
        controller.abort();
      }, 500);
      fetch('https://httpstat.us/200?sleep=1000', {signal}).then(function() {
          proclaim.isError('Abort during fetch failed.');
      }, function(err) {
          proclaim.deepStrictEqual(err.name, 'AbortError');
          done();
      });
  });

//   it('abort during fetch when Request has signal', function() {
//     browser.url(TESTPAGE_URL);
//     const res = browser.executeAsync(async (done) => {
//       setTimeout(function() {
//         done({name: 'fail'});
//       }, 2000);
//       const controller = new AbortController();
//       const signal = controller.signal;
//       setTimeout(function() {
//         controller.abort();
//       }, 500);
//       try {
//         let request = new Request('http://httpstat.us/200?sleep=1000', {signal});
//         await fetch(request);
//       } catch (err) {
//         done(err);
//       }
//     });
//     const err = res.value;
//     expect(err.name).toBe('AbortError');
//     expect(getJSErrors().length).toBe(0);
//   });

//   it('abort before fetch started', function() {
//     browser.url(TESTPAGE_URL);
//     const res = browser.executeAsync(async (done) => {
//       setTimeout(function() {
//         done({name: 'fail'});
//       }, 2000);
//       const controller = new AbortController();
//       controller.abort();
//       const signal = controller.signal;
//       try {
//         await fetch('http://httpstat.us/200?sleep=1000', {signal});
//       } catch (err) {
//         done(err);
//       }
//     });
//     const err = res.value;
//     expect(err.name).toBe('AbortError');
//     expect(getJSErrors().length).toBe(0);
//   });

//   it('abort before fetch started, verify no HTTP request is made', function() {
//     const server = http.createServer((req, res) => {
//       fail('fetch() made an HTTP request despite pre-aborted signal');
//     }).listen(0);
//     const boundListenPort = server.address().port;
//     browser.url(TESTPAGE_URL);
//     const res = browser.executeAsync(async (boundListenPort, done) => {
//       setTimeout(function() {
//         done({name: 'fail'});
//       }, 2000);
//       const controller = new AbortController();
//       controller.abort();
//       const signal = controller.signal;
//       try {
//         await fetch(`http://127.0.0.1:${boundListenPort}`, {signal});
//         done({name: 'fail'});
//       } catch (err) {
//         done(err);
//       }
//     }, boundListenPort);
//     const err = res.value;
//     expect(err.name).toBe('AbortError');
//     expect(getJSErrors().length).toBe(0);
//     server.close();
//   });

//   it('fetch without aborting', function() {
//     browser.url(TESTPAGE_URL);
//     const res = browser.executeAsync(async (done) => {
//       setTimeout(function() {
//         done({name: 'fail'});
//       }, 2000);
//       const controller = new AbortController();
//       const signal = controller.signal;
//       try {
//         await fetch('http://httpstat.us/200?sleep=50', {signal});
//         done('PASS');
//       } catch (err) {
//         done(err);
//       }
//     });
//     expect(res.value).toBe('PASS');
//     expect(getJSErrors().length).toBe(0);
//   });

//   it('fetch without signal set', function() {
//     browser.url(TESTPAGE_URL);
//     const res = browser.executeAsync(async (done) => {
//       setTimeout(function() {
//         done({name: 'fail'});
//       }, 2000);
//       try {
//         await fetch('http://httpstat.us/200?sleep=50');
//         done('PASS');
//       } catch (err) {
//         done(err);
//       }
//     });
//     expect(res.value).toBe('PASS');
//     expect(getJSErrors().length).toBe(0);
//   });

//   it('event listener fires "abort" event', function() {
//     browser.url(TESTPAGE_URL);
//     const res = browser.executeAsync(async (done) => {
//       setTimeout(function() {
//         done({name: 'fail'});
//       }, 2000);
//       const controller = new AbortController();
//       controller.signal.addEventListener('abort', function() {
//         done('PASS');
//       });
//       controller.abort();
//     });
//     expect(res.value).toBe('PASS');
//     expect(getJSErrors().length).toBe(0);
//   });

//   it('signal.aborted is true after abort', function() {
//     browser.url(TESTPAGE_URL);
//     const res = browser.executeAsync(async (done) => {
//       setTimeout(function() {
//         done('FAIL');
//       }, 2000);
//       const controller = new AbortController();
//       controller.signal.addEventListener('abort', function() {
//         if (controller.signal.aborted === true) {
//           done('PASS');
//         } else {
//           done('FAIL');
//         }
//       });
//       controller.abort();
//       if (controller.signal.aborted !== true) {
//         done('FAIL');
//       }
//     });
//     expect(res.value).toBe('PASS');
//     expect(getJSErrors().length).toBe(0);
//   });

//   it('event listener doesn\'t fire "abort" event after removeEventListener', function() {
//     browser.url(TESTPAGE_URL);
//     const res = browser.executeAsync(async (done) => {
//       setTimeout(function() {
//         done('PASS');
//       }, 200);
//       const controller = new AbortController();
//       const handlerFunc = function() {
//         done('FAIL');
//       };
//       controller.signal.addEventListener('abort', handlerFunc);
//       controller.signal.removeEventListener('abort', handlerFunc);
//       controller.abort();
//     });
//     expect(res.value).toBe('PASS');
//     expect(getJSErrors().length).toBe(0);
//   });

//   it('signal.onabort called on abort', function() {
//     browser.url(TESTPAGE_URL);
//     const res = browser.executeAsync(async (done) => {
//       setTimeout(function() {
//         done('FAIL');
//       }, 200);
//       const controller = new AbortController();
//       controller.signal.onabort = function() {
//         done('PASS');
//       };
//       controller.abort();
//     });
//     expect(res.value).toBe('PASS');
//     expect(getJSErrors().length).toBe(0);
//   });

//   it('fetch from web worker works', function() {
//     // Need to load from webserver because worker because security policy
//     // prevents file:// pages from "loading arbitrary .js files" as workers.
//     const server = http.createServer((req, res) => {
//       if (req.url === '/') {
//         // No need to load polyfill in main JS context, we're only gonna run it
//         // inside the worker only
//         res.end('');
//       } else if (req.url === '/umd-polyfill.js') {
//         res.end(fs.readFileSync(path.join(__dirname, '../dist/umd-polyfill.js')));
//       } else if (req.url === '/web-worker.js') {
//         res.end(fs.readFileSync(path.join(__dirname, 'web-worker.js')));
//       }
//     }).listen(0);
//     const boundListenPort = server.address().port;

//     browser.url(`http://127.0.0.1:${boundListenPort}`);
//     const res = browser.executeAsync(async (done) => {
//       setTimeout(function() {
//         done('FAIL');
//       }, 2000);
//       const worker = new Worker('web-worker.js');
//       worker.postMessage('run-test');
//       worker.onmessage = (ev) => {
//         const result = ev.data;
//         done(result);
//       };
//     });
//     expect(res.value).toBe('PASS');
//     expect(getJSErrors().length).toBe(0);
//     server.close();
//   });

//   it('toString() output', function() {
//     browser.url(TESTPAGE_URL);

//     let res;

//     res = browser.executeAsync((done) => {
//       done(new AbortController().toString());
//     });
//     expect(res.value).toBe('[object AbortController]');

//     res = browser.executeAsync((done) => {
//       done(Object.prototype.toString.call(new AbortController()));
//     });
//     expect(res.value).toBe('[object AbortController]');

//     res = browser.executeAsync((done) => {
//       done(new AbortController().signal.toString());
//     });
//     expect(res.value).toBe('[object AbortSignal]');

//     res = browser.executeAsync((done) => {
//       done(new AbortSignal().toString());
//     });
//     expect(res.value).toBe('[object AbortSignal]');

//     res = browser.executeAsync((done) => {
//       done(Object.prototype.toString.call(new AbortSignal()));
//     });
//     expect(res.value).toBe('[object AbortSignal]');
//   });
});
