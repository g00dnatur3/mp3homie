import React, { FC, useEffect } from 'react';
import BaseStyle from '../style/BaseStyle';
import {getTitle} from './getTitle'

const style = new BaseStyle();

// tslint:disable-next-line: variable-name
export const Copyright: FC<{}> = () => {

  useEffect(() => {
  }, [])

  const containerStyle = {
    paddingTop: '0.4rem',
    paddingBottom: '2%',
    // minWidth: 400,
    ...style.centerColumn,
    margin: '0 auto',
    maxWidth: 1000,
    width: '92%'
    // border: '1px solid RED'
  }

  return <div style={containerStyle}>

    {getTitle()}

    <div style={{borderTop: '1px solid DARKGREY', width: '92%', maxWidth: '34rem'}} />

    <div style={{paddingTop: '1.2rem'}} />

    <h4>Copyright</h4>

    <div style={{paddingTop: '0.4rem'}} />

    <div>
<p>mp3gems.com respects the intellectual property rights of others, and requests you to do the same. mp3gems.com does not permit infringement of intellectual property rights on its platform, and will promptly suspend commercial content (served via a publicly available web address / URL) from being able to be converted and downloaded by its platform when kindly notified. </p>
<p>If you’re a content creator/owner, copyright owner or an agent thereof and would like to disable the possible use of mp3gems.com’s platform to convert your publicly available content(s), please kindly send us a request via e-mail with the information stated below and we will blacklist the content(s) in our system within 24 hours. </p>
<p>E-mail: <b>mp3gems@outlook.com</b> </p>
<p>- The URL(s) of the content(s) you want us to block.</p>
<p>- A form of electronic or physical evidence showing that you have the rights to the content(s). </p>
<p>- Contact information that is reasonably sufficient to permit us to contact you, such as an address, telephone number, and a valid e-mail address. </p>
</div>

<div style={{cursor: 'pointer', paddingBottom: '1.2rem', paddingTop: '1.8rem', fontSize: '1.8em' }} onClick={() => history.back()} className="title">go back</div>
</div>

};
