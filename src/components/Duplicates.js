import React from 'react';
import Button from '@material-ui/core/Button';
import CustomDialog from './CustomDialog';
import { min } from 'lodash';

export default class Duplicates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      duplicatesOpen: false
    }

    this.duplicates = {};
    this.withoutMatrixTime = 0;
    this.withMatrixTime = 0;
  }

  handleClose = () => {
    this.setState({ duplicatesOpen: false });
  };

  getPrevEmailSimilarity = (email, index, emails) => {
    if (index <= 0) {
      return;
    }

    const prevEmail = emails[index - 1];
    const prevSim = this.getSimilarity(email, prevEmail);

    if (prevSim >= 0.8) {
      this.duplicates[email] = this.duplicates[email] || [];
      this.duplicates[email].push(prevEmail)
      this.getPrevEmailSimilarity(email, index - 1, emails)
    }
  }

  getNextEmailSimilarity = (email, index, emails) => {
    if ((index + 1) >= emails.length) {
      return;
    }

    const nextEmail = emails[index + 1];
    const nextSim = this.getSimilarity(email, nextEmail);

    if (nextSim >= 0.8) {
      this.duplicates[email] = this.duplicates[email] || [];
      this.duplicates[email].push(nextEmail)
      this.getNextEmailSimilarity(email, index + 1, emails)
    }
  }

  handleDuplicateClick = (e) => {
    this.setState((prevState, prevProps) => {
      let people = prevProps.people;
      this.duplicates = {};
      let data = {};

      if (!people) {
        return { duplicatesOpen: true };
      }

      people.forEach((person) => {
        data.emails = data.emails || [];
        data.emails.push(person.email_address)
      })

      data.emails.sort().map(this.getNextEmailSimilarity);

      console.log(this.duplicates);
      return {
        data: this.duplicates,
        duplicatesOpen: true
      };
    })
  }

  getSimilarity = (emailOne, emailTwo) => {
    let longer = emailOne;
    let shorter = emailTwo;

    if (emailOne.length < emailTwo.length) {
      longer = emailTwo;
      shorter = emailOne;
    }

    const longerLength = longer.length;

    if (longerLength === 0) {
      return 1.0;
    }

    // console.group('edit distances');
    // console.time('without Matrix');
    // console.log('without Matrix: ' + this.getEditDistance(longer, shorter));
    // console.timeEnd('without Matrix')
    // console.time('with Matrix');
    // console.log('with Matrix: ' + this.getEditDistanceWithMatrix(longer, shorter));
    // console.timeEnd('with Matrix');
    // console.groupEnd();

    let startWithoutMatrix = window.performance.now();
    this.getEditDistance(longer, shorter)
    let endWithoutMatrix = window.performance.now();
    this.withoutMatrixTime += (endWithoutMatrix - startWithoutMatrix);

    let startWithMatrix = window.performance.now();
    this.getEditDistanceWithMatrix(longer, shorter)
    let endWithMatrix = window.performance.now();
    this.withMatrixTime += (endWithMatrix - startWithMatrix);

    console.log(this.withoutMatrixTime);
    console.log(this.withMatrixTime);
    // (word length - edit distance) / word length
    return (longerLength - this.getEditDistance(longer, shorter)) / longerLength;
  }

  getEditDistance = (emailOne, emailTwo) => {
    emailOne = emailOne.toLowerCase();
    emailTwo = emailTwo.toLowerCase();

    const costs = [];
    for (let i = 0; i <= emailOne.length; i++) {
      let lastValue = i;

      for (let j = 0; j <= emailTwo.length; j++) {
        // builds [0,1,2,3,4,...emailTwo.length]
        if (i === 0) {
          costs[j] = j;
        }
        else {
          if (j > 0) {
            // the "-1's" are because I used the i=0 loop to build the initial array.
            let newValue = costs[j - 1];

            if (emailOne.charAt(i - 1) !== emailTwo.charAt(j - 1)) {
              // gets minimum cost at location [i-1][j-1]
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }

            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }

      if (i > 0) {
        costs[emailTwo.length] = lastValue;
      }
    }

    return costs[emailTwo.length];
  }

  getEditDistanceWithMatrix = (emailOne, emailTwo) => {
    const length1 = emailOne.length;
    const length2 = emailTwo.length;

    if (!length1) {
      return length2;
    }

    if (!length2) {
      return length1
    }

    const minCostsMatrix = this.createMatrix((length1), (length2))

    minCostsMatrix[length1 - 1][length2 - 1] = this.getReplacementCost(emailOne, emailTwo, length1 - 1, length2 - 1)

    // fill final array with incrementing integers to indicate any extra letter we add to the second string while leaving the first one fixed can only increase the distance by 1
    for (let x = length2 - 2; x >= 0; x--) {
      minCostsMatrix[length1 - 1][x] = (1 + minCostsMatrix[length1 - 1][x + 1]);
    }

    // fill in last index of each array indicate any extra letter we add to the first string while leaving the second one fixed can only increase the distance by 1
    for (let y = length1 - 2; y >= 0; y--) {
      minCostsMatrix[y][length2 - 1] = 1 + minCostsMatrix[y + 1][length2 - 1];
    }

    for (let y = length1 - 2; y >= 0; y--) {
      for (let x = length2 - 2; x >= 0; x--) {
        const replacementCost = this.getReplacementCost(emailOne, emailTwo, y, x) + minCostsMatrix[y + 1][x + 1];
        const deletionCost = 1 + minCostsMatrix[y + 1][x];
        const isertionCost = 1 + minCostsMatrix[y][x + 1];
        minCostsMatrix[y][x] = min([replacementCost, deletionCost, isertionCost]);
      }
    }

    return minCostsMatrix[0][0];
  }

  // chose not to use spread operator b/c I got an error and wasn't here for that kind of debugging.
  createMatrix(length) {
    const arr = new Array(length || 0).fill(0);
    let i = length;

    if (arguments.length > 1) {
      // get new array starting at index 1
      const args = Array.prototype.slice.call(arguments, 1);

      // recursively fill indexes with arrays of the next argument's length
      while (i--) {
        arr[length - 1 - i] = this.createMatrix.apply(this, args);
      }
    }

    return arr;
  }

  getReplacementCost = (string1, string2, s1Index, s2Index) => {
    return (string1.charAt(s1Index) === string2.charAt(s2Index)) ? 0 : 1;
  }

  render() {
    return (
      <span>
        <Button variant="contained" color="primary" onClick={this.handleDuplicateClick}>
          Check for Duplicates
        </Button>
        <CustomDialog
          duplicates
          id={'duplicates'}
          open={this.state.duplicatesOpen}
          handleClose={this.handleClose}
          data={this.state.data}
          title={"Potential Duplicate Email Address Check"}
        />
      </span>
    )
  }
}