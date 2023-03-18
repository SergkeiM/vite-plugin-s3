<p align='center'>
<br>
S3 compatible file uploader Plugin for Vite
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
import { ViteS3 } from '@froxz/vite-plugin-s3'

export default defineConfig({
  plugins: [
    ViteS3(!!process.env.UPLOAD_ENABLED, {
      basePath: '/build',
      clientConfig: {
        credentials: {
          accessKeyId: '',
          secretAccessKey: '',
        },
        region: 'eu-west-2'
      },
      uploadOptions: {
        Bucket: 'my-bucket'
      }
    })
  ]
})
```

## 🚀 Options
- `enabled/disable`: This setting can be used to disable or enable the uploading of assets (In addition Plugin is disabled in SSR and non build run)
- `exclude`: A Pattern to match for excluded content.
- `include`: A Pattern to match for included content.
- `clientConfig`: Provide keys for upload options of [S3ClientConfig](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html)
- `uploadOptions`: Provide upload options [PutObjectRequest](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putobjectrequest.html)
- `basePath`: Provide the namespace of uploaded files on S3
- `directory`: Provide a directory to upload (if not supplied, will upload files from [build.outDir](https://vitejs.dev/config/build-options.html#build-outdir))

#### Advanced `include` and `exclude rules`

`include` and `exclude` in addition to a RegExp you can pass a function which will be called with the path as its first argument.  Returning a truthy value will match the rule.  You can also pass an Array of rules, all of which must pass for the file to be included or excluded.

```javascript
import { defineConfig } from 'vite'
import { ViteS3 } from '@froxz/vite-plugin-s3'
import isGitIgnored from 'is-gitignored'
// Up to you how to handle this
var isPathOkToUpload = function(path) {
    return require('my-projects-publishing-rules').checkFile(path)
}
export default defineConfig({
    plugins: [
        new ViteS3(!!process.env.UPLOAD_ENABLED, {
            // Only upload css and js and only the paths that our rules database allows
            include: [
                /.*\.(css|js)/,
                function(path) { isPathOkToUpload(path) }
            ],
            // function to check if the path is gitignored
            exclude: isGitIgnored,
            clientConfig: {
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
                region: 'eu-west-2'
            },
            uploadOptions: {
                Bucket: 'my-bucket'
            }
        })
    ]
})
```


## 🙏 Thanks

Thanks to [MikaAK](https://github.com/MikaAK) for [s3-plugin-webpack](https://github.com/MikaAK/s3-plugin-webpack) used as inspiration fro this plugin

## 📄 License

MIT License [Froxz](LICENSE)