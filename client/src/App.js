import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class Review extends React.Component{

  constructor() {
    super();
    this.state = {
      movieTitle: "Sample Title",
      movieReview:"Sample Review",
      rating:0
    };
  }




  render(){
    const title = this.state.movieTitle;
    const review = this.state.movieReview;
    return(
      <div>
        <h2>{title}</h2>
        <p>{review}</p>
      </div>
    )
  }
}



class App extends Component {
  render() {
    return (
      <div className="App">
        <Review/>
      </div>
    );
  }
}

export default App;
