import assert from 'assert';
import { NextFunction, Request, Response, Router } from 'express';
import getLog from '../../../utils/log';
import HttpError from '../HttpError';
import { youtube } from 'scrape-youtube';
import exec from 'executive'
import fs from 'fs';

const PWD = process.env.PWD;
const log = getLog(__filename);
const router: Router = Router();

const MAX_VIDEO_DURATION_SECONDS = 2000

const searchCache = {}

const getKey = text => {
  text = text.toLowerCase()
  return text.toString('base64')
    .split('/').join('_')
    .split('+').join('-')
    .split('=').join('$')
}

// const newTorSession = () => {
//   return new Promise((resolve, reject) => {
//     tr.newTorSession(async (err: any) => {
//       if (err) {
//         console.log('failed to obtain new TOR session')
//         reject(err)
//       } else {
//         console.log('new TOR session obtained')
//         resolve(undefined)
//       }
//     })
//   })
// }

// const torRequest = (url, opts={}) => {
//   const reqOptions = {...opts, url, method: 'GET'}
//   return new Promise((resolve, reject) => {
//     const req = tr.request(reqOptions, (err: any, res, body) => {
//       if (err) {
//         reject(err)
//       } else {
//         resolve({req, res, body})
//       }
//     })
//   })
// }

const doSearch = async (text, retryCount=5) => {
  const key = getKey(text)
  if (searchCache[key]) {
    return searchCache[key]
  }
  try {
    const result = await youtube.search(text)
    searchCache[key] = result.videos.filter(video => video.duration <= MAX_VIDEO_DURATION_SECONDS)
    return searchCache[key]
  } catch (err) {
    console.log(err)
    console.log('WARN: unusual traffic from your computer network, retryCount', retryCount)
    if (retryCount > 0) {
      //await newTorSession()
      retryCount--
      return await doSearch(text, retryCount)
    }
    else {
      throw Error('max retries reached -- unusual traffic from your computer network')
    }
  }
}

router.post('/search', async (req: Request, res: Response, next: NextFunction) => {
  log.info('/search', req.body)
  try {
    assert(req.body.text, 'search text is missing')
    const text = req.body.text.trim()
    if (text.length === 0) {
      res.status(200).send([])
    }
    else {
      const result = await doSearch(text)
      res.status(200).send(result)
    }
  }
  catch (err: any) {
    if (!err) {
      log.info('empty error occured :(')
      try {
        //await newTorSession()
        return next(new HttpError(`Oopsie please try again!`, 500))
      }
      catch (err2: any) {
        return next(new HttpError(`Internal error: ${err2.message || err2}`, 500))
      }
    } else {
      log.error(err)
      return next(new HttpError(`Internal error: ${err.message || err}`, 500))
    }
  }
})

router.get('/download', async (req: Request, res: Response, next: NextFunction) => {
  log.info('/download', req.query)
  try {
    assert(req.query.id, 'id is missing')

    const videoUrl = `http://www.youtube.com/watch?v=${req.query.id}`
    const ytdlcmd = `yt-dlp --cookies /home/azureuser/.config/cookies.txt ${videoUrl} -x --audio-format mp3 -f bestaudio --print after_move:filepath`

    console.log()
    console.log('EXEC_CMD: ')
    console.log(ytdlcmd)
    console.log()

    const {stdout} = await exec.quiet(`sudo -H -u azureuser bash -c "${ytdlcmd}"`)

    console.log('STDOUT:')
    console.log(stdout)

    console.log('PWD:', PWD)

    const startIndex = stdout.indexOf(PWD);
    assert(startIndex >= 0, 'could not acquire startIndex from stdout')
    const filename = stdout.substring(startIndex).replace(PWD, '').trim().substring(1)
    console.log('FILENAME:', filename)
    res.attachment(filename);

    res.set({
      "Content-Type": 'audio/mpeg', // or whichever one applies
    });

    const stream = fs.createReadStream(filename);

    stream.on('end', () => {
      console.log('DELETE_CMD:', `sudo rm -rf ${PWD}/'${filename}'`)
      exec.quiet(`sudo rm -rf ${PWD}/'${filename}'`)
    }) 

    stream.pipe(res)
  }
  catch (err: any) {
    log.error(err)
    return next(new HttpError(`Internal error: ${err.message || err}`, 500))
  }
})

router.get('/downloadvideo', async (req: Request, res: Response, next: NextFunction) => {
  log.info('/downloadvideo', req.query)
  try {
    assert(req.query.id, 'id is missing')

    const videoUrl = `http://www.youtube.com/watch?v=${req.query.id}`
    const ytdlcmd = `yt-dlp -f 'best[ext=mp4]/bestvideo[ext=mp4]+bestaudio[ext=m4a]' --username oauth2 --password '' --print after_move:filepath --merge-output-format mp4 ${videoUrl} `

    console.log()
    console.log('EXEC_CMD: ')
    console.log(ytdlcmd)
    console.log()

    const {stdout} = await exec.quiet(`sudo -H -u azureuser bash -c "${ytdlcmd}"`)

    console.log('STDOUT:')
    console.log(stdout)

    console.log('PWD:', PWD)

    const startIndex = stdout.indexOf(PWD);
    assert(startIndex >= 0, 'could not acquire startIndex from stdout')
    const filename = stdout.substring(startIndex).replace(PWD, '').trim().substring(1)
    console.log('FILENAME:', filename)
    res.attachment(filename);


    res.set({
      "Content-Type": 'video/mp4', // or whichever one applies
    });

    const stream = fs.createReadStream(filename);
    stream.pipe(res)
  }
  catch (err: any) {
    log.error(err)
    return next(new HttpError(`Internal error: ${err.message || err}`, 500))
  }
})

export default router;
