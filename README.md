# intern-we3-webgl-gallery

Welcome WE3 devs!

Interactive and realtime artworks have become very popular with the rise of NFT's. Platforms now give artists the ability to sell their creations for crypto currency.

For your starting project we would like you to create a WebGL gallery website.

This project can be broke down in two tasks:

1. Create the website interface

* Create an index page which shows thumbnails of each artwork with a text description.
* Create a gallery page which showcases each of your indivisual artworks example: `/gallery/artwork-1` `/gallery/artwork-2` etc

Please use the Jam3 [nextjs boilerplate](https://github.com/Jam3/nextjs-boilerplate) as the framework.
  
2. Creating the artworks:

We encourage you to use whichever web technology your interested in or want to learn. 

Some popular libraries include:

 * [threejs](https://threejs.org/)
 * [p5js](https://p5js.org/)
 * [pixijs](https://www.pixijs.com/)
 
We recommend you spending at least half a day thinking about what artwork you would like to create, why it's important and which technology is right to execute it.

-----------------------------------
# GETTING STARTED FOR DEVELOPMENT

  * do not use the latest version of node! use `v14.16.1`
   - you can use `nvm` to install and switch node versions. 
   - for example if you're using the version v16.xx.x use the command line tool to run the commands:
    - `nvm install v14.16.1` 
    - `nvm use v14.16.1`
  * Whenever you get a fresh version, don't forget to run `npm install` or `npm i`
  * `npm run dev` will get you a hassle-free local deployment
   - launch chrome in [localhost:3000](http://localhost:3000) for the dev build.
  * Make sure you have ESLint extensions set up in VSCode.

## WHEN COMMITING TO GITHUB
if you run into problems with linter warnings, add the `--no-verify` flag at the end of your `git commit` and `git push` commands.
DISCLAIMER: this is not a good practice withing jam3 but is acceptable in the context of this project.

# DEPLOYING & TROUBLESHOOTING IN GITHUB PAGES

## INSTRUCTIONS

1. Only commit to our own branches and `main`

2. Run a test build in `main` for production (make sure that it's pulled and fetched etc)
 - `npm run build:ssr` (which builds/compiles but does not launch/run the project)
 - `npm run build:prod:static`
 - `cd out`
 - `http-static` (to run on localhost:8080)

3. Don't commit directly to `features/gh-pages`

4. To update the deployed version switch branch you're working on to `feature/gh-pages`
 - `git checkout feature/gh-pages`
 - `git fetch --all`
 - `git pull` and double check to see if it's getting all the new changes from main branch.
 - run the command `npm run deploy` on the branch `feature/gh-pages`. What this does is copy the `/out`  directory from the build in `feature/gh-pages` to the branch `gh-pages` (no feature).

## TROUBLESHOOTING:

1. If it builds successfully and only deploys ugly html directory on github pages, then check if the file `.nojekyll` exists on branch `gh-pages` (**NOT** feature/gh-pages) in the top level directory.
 - if the file isn't there, create a new empty file with the name `.nojekyll` and just commit it manually. changes take 2 minutes to show on the deployed website
 - `.nojekyll` file is not necessary for a local build-and-run

### Main differences from runnning in localhost to github.io:

1. **next.config**
 - On line 50: check if `assetPrefix: '/intern-we3-webgl-gallery/',` is commented out or not. 
 - It should be part of the code for the github deployment. Comment it out for local build!

2. **env.gh-pages** 
 - In the branch `feature/gh-pages`, this file needs to be set with `NEXT_PUBLIC_WEBSITE_SITE_URL="/intern-we3-webgl-gallery"`
 - In the localbuild it can (or should) be an absolute url. Otherwise, if you look at the messages when building you'll see that `sitemap-generator` will complain about the path.

3. **Pathways**
 - make sure all the pathways in `src/components/head/head.js` have the `/intern-we3-webgl-gallery` prefix in the url for the github deploy version.
 - Do the same check for all the favicon files. (just do a general project search for the term favicon.)
  - to troubleshoot the directories check the deployment launch page. right click for 'inspect element' > look for `<head>` tag in html, and do a `cmd + f` to search for "og:url". if it doesn't have `/intern-we3-webgl-gallery` in the prefix then here is your culprit.
 - check /src/data/routes.js and /src/data/gallery.js  if the intern url prefix is in the URLs

4. **Imports**
 - If the error message when you try to run a production build has `ReferenceError: document is undefined`  then go through your code because it might be trying to pre-import a module it hasn't yet loaded into the browser. It is specifically a next.js problem. DM for details

 - If the error message when you try to run a production build has `ReferenceError: document is undefined`  then go through your code because it might be trying to pre-import a module it hasn't yet loaded into the browser. It is specifically a next.js problem. DM for details


GOOD LUCK ⚡️ xoxo 
