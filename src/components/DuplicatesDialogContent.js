import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';

export default class DuplicatesDialogContent extends React.Component {
  render() {
    return (
      <DialogContent>
          {this.props.data && Object.keys(this.props.data).sort().map((email, idx) => {
            return (
              <div key={idx}>
                <div className='letter-container'>{email}</div>
                <ul>
                {this.props.data[email].map((dup, i) => {
                  return <li key={i}>{dup}</li>
                })}
                </ul>
              </div>
            )
          })}
          {
            !this.props.data &&
            <div>
              <p>No Duplicate People Yet.</p>
              <p>Click 'Get People' or scroll down to get people :)</p>
            </div>
          }
      </DialogContent>
    )
  }
}