<p align='center'>
<br>
AWS S3 or any other S3 compatible provider file uploader Plugin for Vite
</p>

<p align='center'>
<a href='https://www.npmjs.com/package/@froxz/vite-plugin-s3' target="__blank">
<img src='https://img.shields.io/npm/v/@froxz/vite-plugin-s3?color=33A6B8&label=' alt="NPM version">
</a>
<a href="https://www.npmjs.com/package/@froxz/vite-plugin-s3" target="__blank">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@froxz/vite-plugin-s3?color=476582&label=">
</a>
<br>
<a href="https://github.com/Froxz/vite-plugin-s3" target="__blank">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/Froxz/vite-plugin-s3?style=social">
</a>
</p>

## 📦 Install

```bash
$ npm i @froxz/vite-plugin-s3
```
## 🦄 Usage

> `uploadOptions` default to `ACL: 'public-read'` so you may need to override if you have other needs.

Add `vite-plugin-s3` plugin to `vite.config.js / vite.config.ts` and configure it:

```ts
import { defineConfig } from 'vite'
import { S3Plugin } from '@froxz/vite-plugin-s3'

export default defineConfig({
  plugins: [
    S3Plugin(true, {
      basePath: '/build',
      clientConfig: {
        credentials: {
          accessKeyId: '',
          secretAccessKey: '',
        },
        region: 'eu-west-2'
      },
      uploadOptions: {
        Bucket: ''
      }

    })
  ]
})
```

## 🚀 Options

- `exclude`: A Pattern to match for excluded content.
- `include`: A Pattern to match for included content.
- `clientConfig`: Provide keys for upload options of [S3ClientConfig](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html)
- `uploadOptions`: Provide upload options [PutObjectRequest](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putobjectrequest.html)
- `basePath`: Provide the namespace of uploaded files on S3
- `directory`: Provide a directory to upload (if not supplied, will upload files from [build.outDir](https://vitejs.dev/config/build-options.html#build-outdir))

## 📄 License

MIT License [Froxz](LICENSE)