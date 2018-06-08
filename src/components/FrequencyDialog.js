import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class FrequencyDialog extends React.Component {
  render() {
    return (
      <Dialog
        fullScreen={false}
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Email Address Character Frequency"}</DialogTitle>
        <DialogContent>
            {this.props.letterHash && Object.keys(this.props.letterHash).sort().map((letter, idx) => {
              return (
                <div key={idx}>
                  <div className='letter-container'>{letter}</div>
                  <div className='letter-container'>{this.props.letterHash[letter]}</div>
                </div>
              )
            })}
            {
              !this.props.letterHash &&
              <div>
                <p>No People Yet.</p>
                <p>Click 'Get People' to get people :)</p>
              </div>
            }
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}