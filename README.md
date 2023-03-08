# Custom emojis (emojos) from Mastodon servers
  
## Features

- Keep a list of Mastodon servers to view their custom emojis and other features like character limit and translation.
- Searching your list looks in the server name and any personal notes you add to it. Tip: You can search for your favorites by typing "favorite".
- Click/tap to copy.
- Light and dark themes. Follows your system preferences but allows manual override.

## 📸

![Screenshot](https://i.imgur.com/UNum05Y.png)

## Test locally
```shell
npm install
npm run dev # start dev server
npm run build # build for production
npm run preview # locally preview production build
```

If you want to run it on a different port:
```shell
npm run dev -- --port 8000
```

<details> 
<summary>Development details</summary>

This app was bootstrapped with Vite as the bundler and dev server and the React template:
```shell
npm create vite@latest name-of-your-project -- --template react
# follow prompts
cd <your new project directory>
npm install <your dependencies>
npm run dev
```

## Service Worker

### With [Vite Plugin PWA](https://vite-pwa-org.netlify.app/guide/)

The plugin was used to: 
- Generate the manifest.
- Configure the manifest with a link in the `head` of the app entry point.
- Generate a service worker.
- Generate a script to register the sw.
See [here](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/src/types.ts) for details on the plugin options.  

Look into:  
- `workbox: Partial<GenerateSWOptions>`. The `GenerateSWOptions` schema is imported from [`workbox-build`](https://github.com/GoogleChrome/workbox/blob/v6/packages/workbox-build/src/schema/GenerateSWOptions.json).

To install the plugin:
```shell
npm i vite-plugin-pwa -D
```
Building the project generates these in the `outDir` (by default `dist`):
```shell
sw.js
workbox-<hash>.js
```
and these in `dist` (always):
```shell
index.html
manifest.webmanifest
registerSW.js # if you choose to generate it
```
`registerSW.js` references `<buildBase>sw.js` (if you choose to generate it)  
`index.html` references `<buildBase>manifest.webmanifest` and `<buildBase>registerSW.js` 
</details>  