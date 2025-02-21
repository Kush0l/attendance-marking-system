// 'use strict';

// const { networkInterfaces } = require('os');

// const nets = networkInterfaces();
// const results = {};

// for (const name of Object.keys(nets)) {
//     for (const net of nets[name]) {
//         const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
//         if (net.family === familyV4Value && !net.internal) {
//             if (!results[name]) {
//                 results[name] = [];
//             }
//             results[name].push(net.address);
//         }
//     }
// }

// // Extract only "Wi-Fi" details
// const wifiIP = results['Wi-Fi'] || 'Wi-Fi not found';
// console.log({ 'Wi-Fi': wifiIP });



// 'use strict';

// const { networkInterfaces } = require('os');

// const nets = networkInterfaces();
// let wifiIP = '';

// for (const name of Object.keys(nets)) {
//     if (name === 'Wi-Fi') { // Only pick "Wi-Fi" interface
//         for (const net of nets[name]) {
//             if (net.family === 'IPv4' && !net.internal) {
//                 wifiIP = net.address;
//                 break; // Stop after the first valid IP
//             }
//         }
//     }
// }

// console.log(wifiIP || 'Wi-Fi not found');


'use strict';

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
let wifiIP = '';

for (const name of Object.keys(nets)) {
    if (name === 'Wi-Fi') { // Only pick "Wi-Fi" interface
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                wifiIP = net.address;
                break; // Stop after the first valid IP
            }
        }
    }
}

// Extract first 3 octets (e.g., "192.168.29")
const partialIP = wifiIP ? wifiIP.split('.').slice(0, 3).join('.') : 'Wi-Fi not found';

console.log(partialIP);
