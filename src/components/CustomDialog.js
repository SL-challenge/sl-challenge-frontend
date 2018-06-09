import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import FrequencyDialogContent from './FrequencyDialogContent';
import DuplicatesDialogContent from './DuplicatesDialogContent';

export default class CustomDialog extends React.Component {
  render() {
    return (
      <Dialog
        fullScreen={false}
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id={this.props.id}>{this.props.title}</DialogTitle>
          {
            this.props.frequency &&
            <FrequencyDialogContent data={this.props.data}/>
          }
          {
            this.props.duplicates &&
            <DuplicatesDialogContent data={this.props.data}/>
          }
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}