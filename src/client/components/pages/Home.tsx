import React, { FC, useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import BaseStyle from '../style/BaseStyle';
import {search, getDownloadUrl, getDownloadVideoUrl} from '../../helpers/ApiHelper';
import format from 'format-duration';
// import Websocket from 'react-websocket';
import SearchBar from '../core/SearchBar';
import Modal from '../core/Modal';
import {openModal, closeModal} from '../../event'
import Grid from '@material-ui/core/Grid';
import qs from 'query-string'
import {getTitle} from './getTitle'
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

const style = new BaseStyle();

const isSafariAndIOS = () => {
  var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isSafari && iOS) {
      return true
  } else {
      return false
  }
}

// tslint:disable-next-line: variable-name
export const Home: FC<{}> = () => {

  const [dimensions, setDimensions] = useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })

  const [videos, setVideos] = useState<any[]>([])
  const [busy, setBusy] = useState(false)
  const [disableDownload, setDisableDownload] = useState(false)
  const [showIframe, setShowIframe] = useState(false)
  // const [webSocket, setWebSocket] = useState(false)
  const [clientId, setClientId] = useState()
  const [searchValue, setSearchValue] = useState()
  const [showDownloadHelp, setShowDownloadHelp] = useState(false)
  const [hideDownloadHelp, setHideDownloadHelp] = useState(true)
  const [timer, setTimer] = useState(0)

  // console.log('videos', videos)
  // console.log('clientId', clientId)

  const spinner = <div style={{border: '0px solid RED', ...style.center}}>
    <Spinner style={{marginTop: 20, marginBottom: 20, opacity: 0.5}} animation="border" variant="primary" />
  </div>

  const doSearch = (text) => {
    setSearchValue(text)
    setBusy(true)
    setShowIframe(false)
    search(text)
    .then(data => {
      setBusy(false)
      window.scrollTo({top: 0, left: 0, behavior: 'smooth' });
      setVideos(data)
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    console.log('GOT HERE - useEffect')
    const handleResize = () => setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    window.addEventListener('resize', handleResize)
    const params = qs.parse(location.search)
    if (params.s) {
      doSearch(decodeURIComponent(params.s.toString()))
    }
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const containerStyle = {
    paddingTop: videos.length > 0 ? !hideDownloadHelp ? '2.5rem' : '0.4rem' : dimensions.height/16,
    paddingBottom: '2%',
    // minWidth: 400,
    ...style.centerColumn,
    margin: '0 auto',
    maxWidth: 1000,
    // border: '1px solid RED',
    fontSize: dimensions.width <= 500 ? 16 : 18
  }

  const onSearchClick = (text) => {
    if (text.trim().length > 0) {
      window.location.href = `/home?s=${encodeURIComponent(text)}`
    } else {
      if (!window.location.href.endsWith('/home')) {
        window.location.href = '/home'
      }
    }
  }

  const getLinksRow = () => {
    const linkStyle = {
      color: 'darkgrey'
    }
    return <div style={{
      border: '0px solid GREEN',
      width: '90%',
      maxWidth: '34rem',
      fontSize: dimensions.width <= 350 ? '0.7em' : '0.8em',
      ...style.centerRow,
      justifyContent: 'space-evenly',
      paddingBottom: '1.4rem',
      paddingTop: '0.2rem'
    }}>
      <a style={linkStyle} href="/terms">terms of use</a>
      <div>|</div>
      <a style={linkStyle} href="/privacy">privacy policy</a>
      <div>|</div>
      <a style={linkStyle} href="/copyright">copyright</a>
      <div>|</div>
      <a style={linkStyle} href="/contact">contact</a>
    </div>
  }

  let iframeLoadCounter = 0

  const displayResults = () => videos.map(video => {
    if (video.title.length >= 56) {
      video.title = video.title.substring(0, 53) + '...'
    }

    const downloadLink = <a style={{display: 'none'}} id={`dl-mp3-${video.id}`} href={getDownloadUrl(video.id, clientId)} />
    const downloadVideoLink = <a style={{display: 'none'}} id={`dl-video-${video.id}`} href={getDownloadVideoUrl(video.id, clientId)} />
    const getDownloadLink = () => document.getElementById(`dl-mp3-${video.id}`) as any
    const getDownloadVideoLink = () => document.getElementById(`dl-video-${video.id}`) as any
    const onDownloadClick = (isVideo=false) => {
      openModal('download-modal')
      setDisableDownload(true)
      setTimeout(() => {
        if (!isVideo) {
          getDownloadLink().click()
        } else {
          getDownloadVideoLink().click()
        }
      }, 15)

      const countDownLoop = (_timer) => {
        console.log('countDownLoop._timer:', _timer)
        setTimer(_timer)
        if (_timer === 0) {
          closeModal('download-modal')
        } else {
          setTimeout(() => {
            --_timer
            countDownLoop(_timer)
          }, 1000)
        }
      }
      const loopTime: Number = Math.ceil(video.duration/60) + 8
      countDownLoop(loopTime)
    }

    // const buttonContent = <span style={{
    //     ...style.centerRow
    //   }}>
    //   download mp3
    // </span>

    const iframeOnLoad = () => {
      iframeLoadCounter++
      console.log('iframeLoadCounter:', iframeLoadCounter)
      console.log('videos.length:', videos.length)
      if (iframeLoadCounter === videos.length/2 || iframeLoadCounter === videos.length) {
        setShowIframe(true)
      }
    }

    return <div style={{
      ...style.row,
      alignItems: dimensions.width <= 600 ? 'start' : 'center',
      // alignContent: 'center',
      justifyContent: 'center',
      width: '94%',
      // maxWidth: '38rem',
      // border: '1px solid BLUE',
      marginBottom: '1.2rem',
      // minHeight: '8rem'
    }}>

      {/* <iframe 
          style={{
            width: '50%',
            display: showIframe ? '' : 'none'
          }}
          onLoad={iframeOnLoad}
          width="50%" src={`https://www.youtube.com/embed/${video.id}?vq=medium`}
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen /> */}

          <img style={{
            width: '50%',
            // border: '1px solid RED',
            borderRadius: 3,
            // display: showIframe ? 'none' : ''
          }} src={video.thumbnail} />

      <div style={{
        width: '50%',
        marginLeft: '0.5rem',
        // border: '1px solid RED',
        height: '100%',
        fontSize: '0.9em'
      }}>
        <div>{video.title}</div>

        <div style={{
            backgroundColor: 'black',
            color: 'white',
            display: 'inline-block',
            paddingLeft: 3,
            paddingRight: 3,
            fontSize: '0.8em',
            marginRight: '0.3rem',
          }}>
            {format(video.duration*1000)}
        </div>

        {/* <button style={{
          marginLeft: '1rem',
          marginTop: '0.3rem'
        }}
        type="button" className="btn btn-success btn-sm">Download</button> */}
        {downloadLink}
        <div>
        {
          disableDownload
          ? <button disabled
            onClick={() => onDownloadClick()}
            style={{
              fontSize: '0.8em',
              marginTop: '0.3rem',
              marginBottom: '0.3rem',
            }} className="btn btn-success btn-sm">
              download mp3
          </button>
          : <button
            onClick={() => onDownloadClick()}
            style={{
              fontSize: '0.8em',
              marginTop: '0.3rem',
              marginBottom: '0.3rem',
            }} className="btn btn-success btn-sm">
              download mp3
          </button>
        }
        </div>
        {downloadVideoLink}
        <div>
        {
          disableDownload
          ? <button disabled
            onClick={() => onDownloadClick(true)}
            style={{
              fontSize: '0.8em',
              marginTop: '0.3rem',
              marginBottom: '0.3rem',
            }} className="btn btn-success btn-sm">
              download video
          </button>
          : <button
            onClick={() => onDownloadClick(true)}
            style={{
              fontSize: '0.8em',
              marginTop: '0.3rem',
              marginBottom: '0.3rem',
            }} className="btn btn-success btn-sm">
              download video
          </button>
        }
        </div>
      </div>
    </div>
  })

  // const handleData = data => {
  //   data = JSON.parse(data)
  //   console.log('data', data)
  //   if (data.clientId) {
  //     console.log('calling setClientId')
  //     setClientId(data.clientId)
  //   }
  //   if (data.status === 'started') {
  //     setDisableDownload(false)
  //     closeModal('main-modal')
  //   }
  // }

  // const handleOpen = () => {
  //   console.log('handleOpen')
  // }

  // const handleClose = () => {
  //   console.log('handleClose')
  // }

  return <div style={containerStyle}>

    <div className={showDownloadHelp ? 'topcorner fadeIn' : 'topcorner fadeOut'} style={{
      border: '1px solid LIGHTGREY',
      marginRight: '0.2rem',
      marginTop: '0.2rem',
      borderRadius: 8,
      paddingLeft: '0.2rem',
      ...style.centerRow,
      display: hideDownloadHelp ? 'none' : 'flex'
    }}>
      <div>
        <div style={{fontSize: '0.8em', fontWeight: 500}}>click blue circle</div>
        <div style={{fontSize: '0.8em', fontWeight: 500, marginTop: -4}}>to see downloads</div>
      </div>
      <div style={{fontSize: '1.8em'}}>👆</div>
    </div>

    {/* <div style={{fontSize: '0.6em', paddingTop: '0.2rem', color: 'grey', fontFamily: '"Lucida Console", Courier, monospace',}}>
      
    </div> */}

    {getTitle()}

    <div style={{
      // border: '1px solid RED',
      width: videos.length > 0 ? '92%' : '90%',
      paddingTop: '0.1rem',
      paddingBottom: '1.3rem',
      ...style.center
    }}>
      <SearchBar value={searchValue} onClick={onSearchClick} />
    </div>

    {busy ? spinner : 
      videos.length ?
        <Grid container style={{
          // maxWidth: 400,
          // border: '0px solid GREEN',
          // ...style.center,
          // paddingTop: '1%',
          // paddingBottom: '2%',
          // marginBottom: 2
          maxWidth: '60rem',
        }}>
          {displayResults().map((result, i) => {
            return <Grid key={`grid-${i}`} container item xs={12} sm={6} lg={4} style={{
              // border: '1px solid RED',
              // // justifyContent: 'flex-start'
              ...style.centerRow,
              // maxHeight: 50,
              // fontSize: 24
            }}>
              {result}
            </Grid>
          })}
        </Grid>
      : null
    }

    {
      window.location.href.endsWith('/home') && !busy
      ? <div>
          <h5 style={{fontFamily: '"Lucida Console", Courier, monospace', color: 'grey'}}>Download Your Music</h5>
          <ul style={{color: 'grey', fontSize: '0.9em'}}>
            <li>use less data</li>
            <li>play when offline</li>
            <li>play when phone locked</li>
            <li>import into itunes</li>
          </ul>      
        </div>
      : null
    }

    {!busy ? getLinksRow() : null}

    {/* <div style={{display: 'none'}}>
      <Websocket url='ws://localhost:3000/api' onMessage={handleData}
        onOpen={handleOpen} onClose={handleClose}
        reconnect={true} debug={true}
        ref={websocket => setWebSocket(websocket)
      } />
    </div> */}

    <Modal id="download-modal" style={{width: '80%', maxWidth: '20rem', ...style.centerColumn}}>
        {spinner}
        <div style={{paddingBottom: '0.6rem'}}>fetching from youtube 🎵</div>
        {!isSafariAndIOS()
          ? <div style={{paddingBottom: '0.6rem'}}>
              {timer}
            </div>
          : null
        }
    </Modal>

    {/* <Modal id="main-modal" style={{width: '80%', maxWidth: '20rem', ...style.centerColumn}}>
        {spinner}
        <div style={{paddingBottom: '0.6rem'}}>Preparing Download</div>
    </Modal> */}


  </div>



};
