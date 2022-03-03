# Komi_bot
linktr.ee/Komi_bot
Copyright (c) 2022 tionescau10k
Todos os direitos resevados 
<div align="center"

# **Komi-Bot**

>Komi-bot, feita para te ajudar pelo WhatsApp!
>
>

<h3 align="center">Tio Nescau</h3>

<p align="center">
  <a href="https://github.com/SlavyanDesu"><img title="Author" src="https://img.shields.io/badge/Author-SlavyanDesu-purple.svg?style=for-the-badge&logo=github" /></a>
</p>

<p align="center">
  <a href="https://github.com/SlavyanDesu/BocchiBot"><img title="Stars" src="https://img.shields.io/github/stars/SlavyanDesu/BocchiBot?color=red&style=flat-square" /></a>
  <a href="https://github.com/SlavyanDesu/BocchiBot/network/members"><img title="Forks" src="https://img.shields.io/github/forks/SlavyanDesu/BocchiBot?color=red&style=flat-square" /></a>
  <a href="https://github.com/SlavyanDesu/BocchiBot/watchers"><img title="Watching" src="https://img.shields.io/github/watchers/SlavyanDesu/BocchiBot?label=watchers&color=blue&style=flat-square" /></a> <br>
  <a href="https://www.npmjs.com/package/@open-wa/wa-automate"><img src="https://img.shields.io/npm/v/@open-wa/wa-automate.svg?color=green" /></a>
  <img src="https://img.shields.io/node/v/@open-wa/wa-automate" />
  <img src="https://img.shields.io/badge/maintained%3F-yes-green.svg?style=flat" />
  <img src="https://img.shields.io/github/repo-size/SlavyanDesu/BocchiBot" /> <br>
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2FSlavyanDesu%2FBocchiBot?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FSlavyanDesu%2FBocchiBot.svg?type=shield"/></a>
  <a href="https://www.codefactor.io/repository/github/SlavyanDesu/BocchiBot"><img src="https://www.codefactor.io/repository/github/SlavyanDesu/BocchiBot/badge" /></a>
</p>

<p align="center">
  <a href="https://github.com/SlavyanDesu/BocchiBot#requirements">Requirements</a> •
  <a href="https://github.com/SlavyanDesu/BocchiBot#installation">Installation</a> •
  <a href="https://github.com/SlavyanDesu/BocchiBot#features">Features</a> •
  <a href="https://github.com/SlavyanDesu/BocchiBot#thanks-to">Thanks to</a> •
  <a href="https://github.com/SlavyanDesu/BocchiBot#license">License</a>
</p>

<h4 align="center">
  <a href="https://chat.whatsapp.com/BXlkQNiaemx4I8oIHjvhP4">Join WA BOT DEV Indonesia!</a>
</h4>
</div>

# Requirements
* [Node.js](https://nodejs.org/en/)
* [Git](https://git-scm.com/downloads)
* [FFmpeg](https://www.gyan.dev/ffmpeg/builds/)
* [Tesseract](https://s.id/vftesseract)
* Any text editor

# Requirements Heroku
* [Chrome](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-chromedriver)
* [FFmpeg](https://elements.heroku.com/buildpacks/jonathanong/heroku-buildpack-ffmpeg-latest)
* [Tesseract](https://elements.heroku.com/buildpacks/matteotiziano/heroku-buildpack-tesseract)
* [Canvas](https://elements.heroku.com/buildpacks/automattic/node-canvas)

> Heroku hosting is not recommended for public group.
>

# Installation
## 📝 Cloning this repo
```cmd
> git clone https://github.com/SlavyanDesu/BocchiBot.git
> cd BocchiBot
```

## ✍️ Editing the file
Edit the required value in `config.json`.
```json
{
    "ownerBot": "62812xxxxxxxx@c.us", 
    "prefix": "$",
    "uaOverride": "WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
    "nao": "api-key",
    "vhtear": "api-key",
    "melodic": "administrator",
    "tobz": "BotWeA",
    "lol": "api-key",
    "authorStick": "@SlavyanDesu",
    "packStick": "BocchiBot"
}
```

`ownerBot`: your WhatsApp number.  
`prefix`: based on the latest update, you don't need to change the prefix, because this bot has multiple prefix.  
`uaOverride`: your user agent.  
`nao`: SauceNAO API key. You can get it [here](https://saucenao.com/user.php) by creating an account.  
`vhtear`: VHTear API key. You can get it [here](https://api.vhtear.com/) by purchasing his API key.  
`melodic`: MelodicXT API key. You can use `administrator` key.   
`tobz`: Tobz API key. You can use `BotWeA` key.   
`lol`: LolHuman API key. You can get it [here](https://lolhuman.herokuapp.com/) by creating an account.  
`authorStick`: name of the author sticker pack.  
`packStick`: name of the sticker pack.  

## 🗣️ Changing language
If you want to change the language to English, replace all `ind` function to `eng`.   
Example:
```js
ind.wrongFormat()
```
To:
```js
eng.wrongFormat()
```

## 🧾 Installing the Tesseract
* Download the file [here](https://s.id/vftesseract).
* After that, run downloaded file as Administrator.
* Complete the installation.
* Run Command Prompt as Administrator.
* Run this command:
```cmd
> setx /m PATH "C:\Program Files\Tesseract-OCR;%PATH%"
```
It will give us a callback like `SUCCESS: specified value was saved`.
* Now that you've Tesseract installed, verify that it's working by running this command to see version number:
```cmd
> tesseract -version
```

## 🛠️ Installing the FFmpeg
* Download one of the available versions of FFmpeg by clicking [this link](https://www.gyan.dev/ffmpeg/builds/).
* Extract the file to `C:\` path.
* Rename the extracted folder to `ffmpeg`.
* Run Command Prompt as Administrator.
* Run this command:
```cmd
> setx /m PATH "C:\ffmpeg\bin;%PATH%"
```
It will give us a callback like `SUCCESS: specified value was saved`.
* Now that you've FFmpeg installed, verify that it's working by running this command to see version number:
```cmd
> ffmpeg -version
```

## 🔍 Installing the dependencies
```cmd
> npm install
```

## 🆗 Running the bot
Regular node:
```cmd
> npm start
```

PM2:
```cmd
> pm2 start index.js
> pm2 monit
```

PM2 with cron job (restart after 5 hours):
```cmd
> pm2 start index.js --cron "* */5 * * *"
> pm2 monit
```

After that scan the QR code using your WhatsApp in your phone!

# Known issue
## ESM error
To prevent this, please use `node-fetch` and `parse-ms` with v2.x version.
```cmd
> npm install node-fetch@2.6.5
> npm install parse-ms@2.1.0
```

# Features
If you want to unlock premium commands, please buy me a coffee at least 1 on Ko-fi platform.
