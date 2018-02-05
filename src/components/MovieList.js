import React, { Component } from 'react';

class MovieList extends Component{
    constructor(props) {
        super(props);

        this.state = {
            movieList: [],
            runtime:"0"
        }

        this.getMovieList = this.getMovieList.bind(this);
    }

    componentDidMount(props) {
        this.setState({ movieList: this.props.giveMovieList });
    }

    //sets the state for movieList
    componentWillReceiveProps(props) {
        this.setState({ movieList: this.props.giveMovieList })
        let run = this.props.giveMovieList.reduce((t, e) => t + e.runtime, 0);;
    }

    //sets the div for each item in the watch list
    getMovieList() {
        
        let html = '';
        let i = 0;
        if (this.props.giveMovieList.length !== 0 || this.props.giveMovieList !== '') {
            html = this.props.giveMovieList.map(e => {
                // run +=e.runtime
                i++;
                return <li className="movieListItem" key={i}> 
                    <div>
                        {e.title} ({e.runtime} minutes)
                    </div>
                    <button className="movieListItemBtn" onClick={() => this.props.deleteFromList(e)}>X</button>
                </li>
            })
        }
        return html;
    }

    //send the movieList back to App.js
    giveMovieList() {
        this.props.giveMovieList(this.state.movieList)
    }

    render() {
        return (
            <div>
                <ul>
                    {this.getMovieList()}
                </ul>
                
            </div>
        )
    }
}

export default MovieList;