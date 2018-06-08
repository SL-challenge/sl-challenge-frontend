import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Zoom from '@material-ui/core/Zoom';

export default class PeopleGrid extends React.Component {
  render() {
    return (
      <Grid container spacing={24}>
        {
          this.props.people && [...this.props.people].map((person, idx) => {
          return (
            <Grid item md key={idx}>
              <Zoom in={true}>
                <Card raised={true}>
                  <div className='card-container'>
                    <p>{person.first_name + ' ' + person.last_name}</p>
                    <p>{person.title}</p>
                    <p>{person.email_address}</p>
                  </div>
                </Card>
              </Zoom>
            </Grid>
          )
        })
        }
      </Grid>
    )
  }
}