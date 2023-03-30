<h1 align="center">
  <br>
  <a href=""><img src="doc/logo/canvas_logo.svg" alt="Project Canvas Logo" width="200"></a>
  <br>
  Project Canvas
  <br>
</h1>

<h4 align="center">A project management desktop app built with TypeScript, React, and <a href="https://www.electronjs.org" target="_blank">Electron</a>.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

![screenshot](./doc/Project%20Canvas%20Scrennshots.png)

## Key Features

- Dark/Light mode
- Cross platform Windows, macOS and Linux ready.

## How To Contribute

### Installation

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. Preferrably you can use the [yarn]() package manager.
From your command line:

Clone the repository

```bash
git clone https://github.com/maibornwolff/project-canvas
```

Go into the folder

```bash
cd ProjectCanvas
```

Install dependencies

```bash
yarn install
```

### Usage

To build project extender(the backend) and start project canvas

```bash
yarn canvas
```

To only build and start project extender

```bash
yarn extender
```

To add a new package (**this is important as this is a monorepo**)  
`project` can be `project-canvas`, `project-extender`

```bash
yarn workspace <project> add <package>
```

## Download

Download Project Canvas from the [Releases](https://github.com/maibornwolff/ProjectCanvas/releases) section and start using it! As simple as that.

> Note: please keep in mind that you need to have an account by Provider you choose to use, for example Jira Cloud or Jira Server.

## Credits

This software uses the following open source packages:

- [Electron](http://electron.atom.io/)
- [Node.js](https://nodejs.org/)

## License

BSD-3-Clause

---

> [maibornwolff.de](https://www.maibornwolff.com) &nbsp;&middot;&nbsp;
> GitHub [@maibornwolff](https://github.com/maibornwolff)
