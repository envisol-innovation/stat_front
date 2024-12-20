# Welcome to the stat_front code!

Because they contain secret data, two files aren't versioned in this repository: auth_config.json and .env
auth_config.json : contains authentication data
.env contain notably the backend url

They should NEVER be versioned (they contain secret data)


To run locally the code needs node 18.20.4
If you have more than one node version installed, use nvm like so in the terminal:
1 to check the current version of node and which are available on your computer:
nvm list
2 to choose the correct one 
nvm use 18.20.4

then in the stats_front directory you should run the following commands in the terminal
npm install
npm run dev

The url where the dev demo is running will appear in the terminal
By default it will be: http://localhost:3000/

For backend interaction to work, the variable BACKEND_BASE_URL should point to an active api


The main branch sould only be for production code that is ready to be online



# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
