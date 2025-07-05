// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { FC } from 'react';
import Button from 'react-bootstrap/Button';

interface Props {
  disabled: boolean;
  onClick: (e: any) => void;
  style?: React.CSSProperties;
  buttonText?: string;
}

const defaultStyle = {
  marginTop: 8,
  marginBottom: 8,
};

// tslint:disable-next-line: variable-name
export const SubmitButton: FC<Props> = (props) => {

  const style = props.style || {};

  return <Button
      style={{...defaultStyle, ...style}}
      disabled={props.disabled}
      onClick={props.onClick}
      variant="primary">
        
    <Typography style={{color: 'white'}}>{props.buttonText || 'submit'}</Typography>
  </Button>;
};

export default SubmitButton;
