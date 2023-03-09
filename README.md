# Custom emojis (emojos) from Mastodon servers
  
## Features

- Keep a list of Mastodon servers to view their custom emojis and other features like character limit and translation.
- Searching your list looks in the server name and any personal notes you add to it. Tip: You can search for your favorites by typing "favorite".
- Click/tap to copy emojos.
- Light and dark themes. Follows your system preferences but allows manual override.
- Install as an app on desktop and mobile for [browsers that support it](https://web.dev/learn/pwa/progressive-web-apps/#compatibility).
- Shareable URLs.

## 📸

### Light/dark themes
![Screenshot](https://i.imgur.com/UNum05Y.png)  

### Installed as an OS app

<p>
  macOS <br>
  <img src="https://i.imgur.com/n6POC5o.png"  width="70%">
</p>
<p>
  iOS <br>
  <img src="https://i.imgur.com/t879fE0.png"  width="30%">
</p>

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

## Development details
<details> 
<summary>See more</summary>

The app was bootstrapped with [Vite](https://vitejs.dev) as the bundler and dev server and the React template:
```shell
npm create vite@latest name-of-your-project -- --template react
# follow prompts
cd <your new project directory>
npm install <your dependencies>
npm run dev
```
Icons created with [Favicon Generator](https://realfavicongenerator.net).  

The service worker was generated with [Vite Plugin PWA](https://vite-pwa-org.netlify.app/guide/). It was used to: 
- Generate the manifest.
- Configure the manifest with a link in the `head` of the app entry point.
- Generate a service worker.
- Generate a script to register the sw.
See [here](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/src/types.ts) for details on the plugin options.  

To install the plugin:
```shell
npm i vite-plugin-pwa -D
```

### Recommended deployment
The current deployment has these characteristics:
- Hosted as a secure static site on object storage (S3). 
- Served through a CDN (CloudFront). 
  - A CloudFront Function to rewrite URIs that are meant to be handled by client-side routing.
  - A Content Security Policy for the response headers from the distribution.
  - Using edge locations in North America and Europe.
- Users routed by Route 53 with a custom domain.
- Using Infrastructure as Code (CloudFormation).
</details>  