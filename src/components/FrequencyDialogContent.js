import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';

export default class FrequencyDialogContent extends React.Component {
  render() {
    return (
      <DialogContent>
          {this.props.data && Object.keys(this.props.data).sort().map((letter, idx) => {
            return (
              <div key={idx}>
                <div className='letter-container'>{letter}</div>
                <div className='letter-container'>{this.props.data[letter]}</div>
              </div>
            )
          })}
          {
            !this.props.data &&
            <div>
              <p>No People Yet.</p>
              <p>Click 'Get People' to get people :)</p>
            </div>
          }
      </DialogContent>
    )
  }
}