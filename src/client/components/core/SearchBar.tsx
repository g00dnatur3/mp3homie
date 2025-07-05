import React, { FC, useEffect } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import BaseStyle from '../style/BaseStyle';

interface Props {
  onClick: (e: any) => void;
  value?: string
}

const style = new BaseStyle();

// tslint:disable-next-line: variable-name
export const SearchBar: FC<Props> = (props) => {

  const _onClick = () => {
    const el = document.getElementById("search-input") as any
    const text = el.value
    el.blur()
    props.onClick(text)
  }

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      _onClick()
    }
  }
  
  useEffect(() => {
    if (props.value) {
      (document.getElementById("search-input") as any).value = props.value
    }
  }, [props.value])

  return <InputGroup size="lg" style={{
    maxWidth: '34rem',
  }}>
    <FormControl id="search-input" placeholder="Search song or artist" aria-label="Large" aria-describedby="inputGroup-sizing-sm" onKeyPress={handleKeyPress} />
    <InputGroup.Prepend>
      <button style={{
        // border: '1px solid RED',
        ...style.centerColumn,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3
      }} className="btn btn-outline-secondary">
        <i onClick={_onClick} className="fa fa-search" />
      </button>        
    </InputGroup.Prepend>
    
  </InputGroup>
}

export default SearchBar
