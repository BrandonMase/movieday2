import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import SearchedMovies from './components/SearchedMovies'
import MovieList from './components/MovieList'
import Header from './components/Header';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      savedMovies: [],
      listName: "",
      userInput: '',
      searchedMovies: null,
      numOfMovies: 0,
      user:null,
    }
  
    this.updateUserInput = this.updateUserInput.bind(this);
    this.searchForMovie = this.searchForMovie.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.updateWatchList = this.updateWatchList.bind(this);
    this.getMovieList = this.getMovieList.bind(this);
    this.deleteFromList = this.deleteFromList.bind(this);
    this.updateListName = this.updateListName.bind(this);
  }

  componentDidMount() {

    //get the movie list from the db
    axios.get("/api/getList").then(res => {
      this.setState({ numOfMovies: res.data.length, savedMovies: res.data })
    });

    //get the listName from the db
    axios.get("/api/getListName").then(res => {
      console.log("listName",res.data)
      this.setState({listName:res.data})
    })

    axios.get('/api/user-data').then(res => {
      this.setState({ user: res.data.user });
    })
  }

  login() {
    window.location = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/login?client=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${encodeURIComponent(window.location.origin)}/auth/callback`

  }

  shouldComponentUpdate(prevProps, prevState) {
    if (this.state !== prevState) {
      return true;
    }
    return false;
  }

  //Update user input onChange
  updateUserInput(e) {
    this.setState({ userInput: e })

  }
  
  //Search for the movie using userInput 
  searchForMovie() {
    const API_KEY = "945a8ef7bd0dea97770e4b0bdfe53d86";
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${this.state.userInput}&page=1&include_adult=false`).then(res => {
    
      this.setState({searchedMovies:res.data.results});
    })
  }

  //returns search results and adds the searchedMovies component each
  getSearchResults() {
    let searchResults = '';
    if (this.state.searchedMovies !== null) {
      searchResults = <SearchedMovies searchMovieList={this.state.searchedMovies} updateWatchList={this.updateWatchList}/>
    }
    return searchResults;
  }
  
  //updates the watch list with title and id  and adds +1 to the number of movies
  //also changes the color of the number button green for 3 seconds
  //j sends back the link selector so we can do a preventDefault
  updateWatchList(e,j) {
    j.preventDefault();
    const API_KEY ="945a8ef7bd0dea97770e4b0bdfe53d86";
    
    //does the axios call to themoviedb api 
    axios.get(`https://api.themoviedb.org/3/movie/${e.id}?api_key=${API_KEY}&language=en-US`).then(res => {
      var obj = { title: e.title, id: e.id, runtime: res.data.runtime };
      axios.post("/api/addToList",obj).then(res2 => {
        this.setState({ savedMovies: res2.data });
      }).catch((error) => console.log(error))
    })
    
    //adds 1 to the number of movies
    let num = parseInt(this.state.numOfMovies,10) + 1;
    this.setState({numOfMovies:num})
    
    //changes the numCounterBtn to green for 3 seconds
    document.getElementById('numCounterBtn').style.color = "#00ff37";
    setTimeout(function () { document.getElementById('numCounterBtn').style.color = "white" }, 3000);
  }

  //deletes the selected movie from the watch list and -1 to the number of movies
  //also changes the color of the number button to red for 3 seconds
  deleteFromList(e) {
    //does the axios call to delete the selected movie
    let num = parseInt(this.state.numOfMovies) - 1
    axios.delete(`/api/deleteFromList/${e.id}`).then(res => {
      this.setState({savedMovies:res.data,numOfMovies:num})
    })
    
    //changes the color for the numCounterBtn to red for 3 seconds
    document.getElementById('numCounterBtn').style.color = "red";
    setTimeout(function () { document.getElementById('numCounterBtn').style.color = "white" }, 3000);
  }
  
  //gets the movieList and renders the movieList component
  getMovieList() {
    let html = <p>Nothing here yet</p>

    if (this.state.savedMovies.length !== 0) {
      html = <MovieList giveMovieList={this.state.savedMovies} deleteFromList={this.deleteFromList} />
    }

    return html;
  }

  //updates the listName based once the inputDiv blurs
  updateListName(e) {
    let listName = this.state.listName
    axios.put(`/api/updateListName/${listName}`).then(res => {
      this.setState({ listName: res.data });
    })
  }

  //shows and hides the movieListDiv
  showDiv() {
    if (document.getElementById('movieListDiv').style.display == "none") {
      document.getElementById('movieListDiv').style.display = "block";
      document.getElementById('inputDiv').style.display = "block";
      document.getElementById('movieList').style.backgroundColor = "#333";
      document.getElementById('movieList').style.zIndex = "200";
      // document.getElementById('movieList').style.position = "relative";
    }
    else {
      document.getElementById('movieListDiv').style.display = "none";
      document.getElementById('inputDiv').style.display = "none";
      document.getElementById('movieList').style.backgroundColor = "transparent";
      document.getElementById('movieList').style.zIndex = "0";
    }
  }  





  render() {
    const { user } = this.state;
    const userData = JSON.stringify(user);
    return (
      <div className="App">
        <Header headerOrFooter="header" />
        <button onClick={this.login}>Login</button>
        <div>{userData || null}</div>
        <div id="movieList" className="movieList">
          <div className="numCounter">
            <button id="numCounterBtn" className="numCounterBtn" type="checkbox" onClick={this.showDiv} >{this.state.numOfMovies}</button>
            <input onBlur={this.updateListName} id="inputDiv" className="inputBtn" placeholder="List Name Here" onChange={e => this.setState({listName:e.target.value})} value={this.state.listName} />
          </div>
          <div id="movieListDiv">
            {this.getMovieList()}
            </div>
        </div>
        <ul>
        </ul>
        <input placeholder="Search for something" className="searchInput"  onChange={(e) => this.updateUserInput(e.target.value)} />
        <button className="searchBtn" onClick={this.searchForMovie}>Search For Movie</button>
        <div className="searchResultsDiv">
          {this.getSearchResults()}
        </div>  
        <Header headerOrFooter="footer" />
      </div>
    );
  }
}

export default App;
