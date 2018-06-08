import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function InfiniteGrid(WrappedComponent) {
  return class InfiniteGrid extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        isLoadingItems: false
      }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.isLoadingItems !== nextProps.isLoadingItems) {
        return { isLoadingItems: nextProps.isLoadingItems }
      }

      return null;
    }

    handleScroll = (event) => {
      const scrollTop = event.target.scrollTop;
      const gridBottom = event.target.childNodes[0].clientHeight;

      if (this.shouldLoadMorePeople(scrollTop, gridBottom)) {
        this.setState({ isLoadingItems: true }, () => {
          console.log('loading people');
          this.props.getPeople();
        });
      }
    }

    shouldLoadMorePeople = (scrollTop, gridBottom) => {
      if (this.state.isLoadingItems) {
        return false;
      }

      return gridBottom - scrollTop < 750;
    };

    render() {
      return (
        <div className="persons-container" onScroll={this.handleScroll}>
          <WrappedComponent people={this.props.people} {...this.props}/>
          {
              this.props.isLoadingItems &&
              <div className='progress-bar'>
                <CircularProgress />
              </div>
            }
        </div>
      )
    }
  }
}