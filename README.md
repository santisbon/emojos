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

> This React app was bootstrapped with Vite as the bundler and dev server. To create a new app in the same way, install Node.js and run:
> ```shell
> npm create vite@latest name-of-your-project -- --template react
> # follow prompts
> cd <your new project directory>
> npm install <your dependencies>
> npm run dev
> ```