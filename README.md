# unPass

<p align="center">
  <a href="https://github.com/unmilley/unPass/blob/main/LICENSE"><img src="https://img.shields.io/github/license/unmilley/unPass.svg?style=flat&colorA=262626&colorB=d7d7d7"></a>
</p>

## Development

<details>

<summary>local development</summary>

### Tauri

- Follow the instructions from [Tauri](https://v2.tauri.app/start/prerequisites/)

### Node

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run the application using `pnpm dev` as web
- Run the application using `pnpm dev:tauri` as app/web

### Git

##### Stop tracking a file from an indexed file:

- `git update-index --assume-unchanged <filename>`
  - `app\src\constants\key.ts`
- `git update-index --no-assume-unchanged <filename>` <- back
</details>

###

Made with 💛
