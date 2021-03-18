'use strict'

const { promisify } = require('util')
const stream = require('stream')
const mkdirp = require('mkdirp')
const path = require('path')
const util = require('util')
const got = require('got')
const fs = require('fs')

const pipeline = promisify(stream.pipeline)

const [, , ...flags] = process.argv

const isWin = flags.includes('--platform=windows') || require('./util').isWin

const getVersion = str =>
  /releases\/download\/(\d{4}\.\d\d\.\d\d(\.\d)?)\/youtube-dl/.exec(str)[1]

// First, look for the download link.
let dir
let filePath
const defaultBin = path.join(__dirname, '..', 'bin')

function download(url, callback) {
  pipeline(
    got.stream(url),
    fs.createWriteStream(filePath, { mode: 493 })
  )
    .then(_ => callback(null, getVersion(url)))
    .catch(callback)
}

const exec = path => (isWin ? path + '.exe' : path)

function createBase(binDir) {
  dir = binDir || defaultBin
  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir)
    if (binDir) mkdirp.sync(defaultBin)
  }
  filePath = path.join(dir, exec('youtube-dl'))
}

function downloader(binDir, callback) {
  if (typeof binDir === 'function') {
    callback = binDir
    binDir = null
  } else if (!callback) {
    return util.promisify(downloader)(binDir)
  }

  createBase(binDir)

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath)
    } catch (e) {
      callback(e)
    }
  }

  getLatestFromGithub().then(latestURL => {
    download(latestURL,
      function error(err, newVersion) {
        if (err) return callback(err)
        return callback(null, 'Downloaded youtube-dl ' + newVersion)
      }
    )
  })
}

async function getLatestFromGithub() {
  const data = await got.get("https://api.github.com/repos/ytdl-org/youtube-dl/releases/latest", { headers: { 'User-Agent': 'distube' } }).json()
  if (!data || !Array.isArray(data.assets)) throw new Error("Cannot get the latest version of youtube-dl")
  for (let asset of data.assets) {
    if (asset.name === "youtube-dl" + (isWin ? ".exe" : "")) {
      return asset.browser_download_url;
    }
  }
  throw new Error("Cannot find the latest version of youtube-dl")
}

module.exports = downloader