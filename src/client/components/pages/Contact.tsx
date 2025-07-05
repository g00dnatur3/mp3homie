import React, { FC, useEffect } from 'react';
import BaseStyle from '../style/BaseStyle';
import {getTitle} from './getTitle'

const style = new BaseStyle();

// tslint:disable-next-line: variable-name
export const Contact: FC<{}> = () => {

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

    <h4>Contact Us</h4>

    <div style={{paddingTop: '0.4rem'}} />

    <div style={{...style.centerColumn, width: '92%'}}>

<div>
<b>mp3gems@outlook.com</b>
</div> 
<div style={{paddingTop: '0.8rem'}} />

<div style={{fontSize: '0.9em'}}>For advertising, copyright, technical issues or any other inquiries.</div>
</div>

<div style={{cursor: 'pointer', paddingBottom: '1.2rem', paddingTop: '1.8rem', fontSize: '1.8em' }} onClick={() => history.back()} className="title">go back</div>

</div>

};
