import React, { FC, useEffect } from 'react';
import BaseStyle from '../style/BaseStyle';

const style = new BaseStyle();

export const getTitle = () => {
  const onTitleClick = () => {
    window.location.href = "/home"
  }
  return <div style={{
    ...style.centerRow,
    justifyContent: 'space-evenly',
    cursor: 'pointer', paddingBottom: '0.2rem'}} onClick={onTitleClick}>
    
    <div className="title">mp3</div>
    <img style={{
      width: '2.7rem',
      paddingLeft: '0.1rem',
      paddingRight: '0.1rem',
      // border: '1px solid RED'
    }} src="/images/gem.png" />
    <div className="title">gems</div>
  </div>
}
