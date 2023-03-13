
vite-plugin-s3-storage
===
[![Travis Badge](https://api.travis-ci.org/Froxz/vite-plugin-s3.svg?branch=master)](https://travis-ci.org/Froxz/vite-plugin-s3)

This package was heavily inspired by [webpack-s3-plugin](https://www.npmjs.com/package/webpack-s3-plugin)

This plugin will upload all built assets to s3 uses `@aws-sdk/client-s3` **v3**


### Install Instructions

```bash
$ npm i vite-plugin-s3-storage
```

### Options

- `exclude`: A Pattern to match for excluded content.
- `include`: A Pattern to match for included content.
- `clientConfig`: Provide keys for upload options of [S3ClientConfig](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html)
- `uploadOptions`: Provide upload options [PutObjectRequest](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putobjectrequest.html)
- `basePath`: Provide the namespace of uploaded files on S3
- `directory`: Provide a directory to upload (if not supplied, will upload files from [build.outDir](https://vitejs.dev/config/build-options.html#build-outdir))
- `progress`: Enable progress bar (defaults true)

### Usage Instructions

> s3UploadOptions default to `ACL: 'public-read'` so you may need to override if you have other needs.

```javascript
import { defineConfig } from 'vite'
import S3Plugin from 'vite-plugin-s3-storage'

export default defineConfig({
    plugins: [
        S3Plugin(true, {
            basePath: '/build',
            clientConfig: {
                credentials: {
                    accessKeyId: '',
                    secretAccessKey: '',
                },
                region: ''
            },
            uploadOptions: {
                Bucket: ''
            }
            
        })
    ]
})
```