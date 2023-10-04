# Custom emojis from Fediverse servers 
Progressive Web App (PWA) to keep track of fediverse server info.

## Test locally

Node 20 seems to break Babel which breaks React so if you run into that issue you should use Node 18 and add it to your PATH e.g.
```shell
brew install node@18
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
```

Run the app
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

## Details
<details> 
<summary>See more</summary>

## Development
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

## Recommended deployment
The current deployment has these characteristics:
- Hosted as a secure static site on object storage (S3). 
- Served through a CDN (CloudFront). 
  - A CloudFront Function to rewrite URIs that are meant to be handled by client-side routing.
  - A Content Security Policy for the response headers from the distribution.
  - Using edge locations in North America and Europe.
- Users routed by Route 53 with a custom domain.
- Using Infrastructure as Code (CloudFormation).
</details>  