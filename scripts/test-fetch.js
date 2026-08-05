const http = require('http');

function testUrl(urlPath) {
  http.get(`http://localhost:3000${urlPath}`, (res) => {
    console.log(`\n--- TESTING ${urlPath} ---`);
    console.log('STATUS:', res.statusCode);
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('BODY LEN:', data.length);
      console.log('BODY HEAD:\n', data.substring(0, 400));
    });
  }).on('error', (err) => console.error('ERR:', err.message));
}

testUrl('/company/about');
setTimeout(() => testUrl('/company/trust/trust-safety'), 2000);
