import _Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import {events, offEvent, onEvent} from '../../event';

import getLog from '../../../utils/log';
const log = getLog('Modal');

const styles: any = (theme) => ({
  paper: {
    position: 'absolute',
    width: screen.width,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit,
  },
});

const modalStyle = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

interface Props {
  classes: any;
  id: string;
  style?: React.CSSProperties;
}

class Modal extends React.Component<Props> {

  public state = {open: false};

  public open = () => this.setState({ open: true });

  public close = () => this.setState({ open: false });

  public _openListener: (id) => void = (id) => {
    if (this.props.id === id) { this.open(); }
  }

  public _closeListener: (id) => void = (id) => {
    if (this.props.id === id) { this.close(); }
  }

  public componentDidMount() {
    log.info('componentDidMount');
    onEvent(events.openModal, this._openListener);
    onEvent(events.closeModal, this._closeListener);
  }

  public componentWillUnmount() {
    if (this._openListener) { offEvent(events.openModal, this._openListener); }
    if (this._closeListener) { offEvent(events.closeModal, this._closeListener); }
  }

  public render() {
    const { classes, style } = this.props;
    const _style = style ? {...modalStyle, ...style} : modalStyle;
    return (
      <_Modal
        disableBackdropClick
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        open={this.state.open}
        onClose={this.close}>
        <div style={_style} className={classes.paper}>
          {this.props.children}
        </div>
      </_Modal>
    );
  }
}

export default withStyles(styles)(Modal);
