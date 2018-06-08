import React, { Component } from 'react';
import ButtonBar from './components/ButtonBar';
import Header from './components/Header';
import InfiniteGrid from './components/InfiniteGrid';
import PeopleGrid from './components/PeopleGrid';
import axios from 'axios';
import './App.css';

const InfinitePeopleGrid = InfiniteGrid(PeopleGrid);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nextPage: 1,
      isLoadingItems: false
    }
  }

  componentDidMount() {
    // window.addEventListener('scroll', this.handleScroll)
  }

  getPeople = () => {
    let url = 'https://localhost:1701/users';

    if (this.state.nextPage) {
      url += '?page=';
      url += this.state.nextPage;
    }

    this.setState({isLoadingItems: true})

    axios.get(url).then(this.addPeople)
  }

  addPeople = (res) => {
    this.setState((prevState) => {
      let prevPeople = prevState.people || [];
      let nextPeople;
      let nextPage;
      let people;

      if (res.data && res.data.data) {
        nextPeople = res.data.data;
      }

      if (res.data && res.data.metadata && res.data.metadata.paging && res.data.metadata.paging.next_page) {
        nextPage = res.data.metadata.paging.next_page
      }

      people = prevPeople.concat(nextPeople);

      return {
        people,
        nextPage,
        clicked: true,
        isLoadingItems: false
      }
    });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <ButtonBar
          getPeople={this.getPeople}
          people={this.state.people}
          clicked={this.state.clicked}
        />
        <InfinitePeopleGrid
          getPeople={this.getPeople}
          people={this.state.people}
          isLoadingItems={this.state.isLoadingItems}
        />
      </div>
    );
  }
}

export default App;
