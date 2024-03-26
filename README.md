<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/maibornwolff/ProjectCanvas/main/public/project_canvas_logo.svg" alt="ProjectCanvas" width="200"/>
  <br>
  Project Canvas
  <br>
</h1>

## Installation

Make sure you have a node interpreter installed via a node manager (such as [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)).
For more information on node managers see the [NPM docs](https://npm.github.io/installation-setup-docs/installing/using-a-node-version-manager.html).

Ensure [`yarn`](https://yarnpkg.com/) is installed via `corepack`. If it is not, run `corepack enable` somewhere in your CLI.

To install all dependencies, run
```shell
yarn install
```

To start the local dev server, simply run
```shell
yarn run start
```

## Publish a release

To publish a release for this project, do the following:
1. Increment the version of this project in the `package.json`
2. Commit and push your changes
3. Ensure your secrets are correctly configured in GitHub (see [the release workflow](/.github/workflows/release.yaml))
4. Run the release workflow manually via the "Actions" tab and select the main branch to release from

If you are not hosting this project on GitHub or want to publish a release locally, you can follow these steps after step 1.:
2. Ensure your secrets are correctly configured in the `.env` file
3. Run `yarn run release`

## Run static analysis

You can run static analysis on this project using [Sonarqube](https://www.sonarsource.com/products/sonarqube/) and [CodeCharta](https://maibornwolff.github.io/codecharta/).

Prerequisites:
1. Set up a sonarqube instance (e.g. install a local instance via Docker or use the [docker compose file](https://github.com/MaibornWolff/codecharta/blob/main/docker-compose.yml) provided in the CodeCharta source)
2. Configure a fresh project (i.e. obtain a project key) and set up an analysis user (i.e. obtain an authentication token)
3. Get the sonarqube scanner CLI tool (e.g. install a binary into your PATH or run a docker image. For more information see the [CLI tool docs](https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/))

To run the scanner in the project, fill in the placeholders, execute in the project root:
```shell
sonar-scanner \     
  -Dsonar.projectKey=<project-key> \
  -Dsonar.sources=src,types,electron,e2e \
  -Dsonar.host.url=<sonarqube-url> \
  -Dsonar.token=<auth-token>
```

After a little while, the finished analysis will appear in your Sonarqube instance

### Import into CodeCharta

You first have to convert the current analysis data from Sonarqube into the CodeCharta JSON format:
```shell
ccsh sonarimport -u <auth-token> -o canvas.cc.json -nc <sonarqube-url> <project-key>
```

