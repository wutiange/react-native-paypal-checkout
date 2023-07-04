#!/usr/bin/env node
'use strict';

// 通过这个脚本，可以生成 clientId 和 secret 的数据，这样就可以不暴露相关值到网络上
const fs = require('fs');
const Buffer = require('buffer').Buffer;

function encodeAndBase64(str, encoding) {
  return Buffer.from(str, encoding).toString('base64');
}

function createAuthorization({ clientId, secret }) {
  const usernameAndPassword = `${clientId}:${secret}`;
  const encoded = encodeAndBase64(usernameAndPassword, 'latin1');
  return `Basic ${encoded}`;
}

// 将生成的 encoded 值写入到 data.js 文件中
function whiteDataFileContent(data) {
  const filePath = './src/data.json';
  fs.writeFileSync(filePath, data, 'utf-8');
}

/**
 * 接收用户的输入，比如是一个 json 字符串，然后解析出 clientId 和 secret 数组
 * @returns {Record<String, {clientId: String, secret: string}>}
 */
function parseInput() {
  const input = process.argv[2];
  return JSON.parse(input);
}

/**
 * 
 "{
  \"xiao\": {
    \"clientId\": \"你的clientId\",
    \"secret\": \"你的secret\"
  }
 }"
 */

// 将拿到的值，生成 encoded 值，有几组就生成几个
function createEncoded() {
  const obj = {};
  Object.entries(parseInput()).forEach(([key, value]) => {
    const encoded = createAuthorization(value);
    obj[`${key}$$clientId`] = value.clientId;
    obj[key] = encoded;
  });
  whiteDataFileContent(JSON.stringify(obj, null, 2));
}

/**
 * clientId:
                'AXRqEAs6zVzF7u5Pd9ldBtZwL8VSYogHqBeXvzLdmcVFm5yPZzjIyRC7gQwTVxglLxk1t-TEVzBFw8Z3',
              secret:
                'EO4fO8gAeI21UZkITvK-ideME_kqgRAHazmOa_nctbBrlLotqXAIiRagtEKf1KoHVeOCPsjOJCKW1Q0E',
 */
createEncoded();
