import React, { Component } from 'react';

class SearchedMovies extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchMovieList: null,
        }

        this.getSearchListHTML = this.getSearchListHTML.bind(this);
    }

    componentDidMount(props) {
        this.setState({ searchMovieList: this.props.searchMovieList })
    }

    //sets the div container for the each of the searched movies
    getSearchListHTML() {
        let html = <p>Nothing found</p>
        if (this.props.searchMovieList !== []) {
            html = this.props.searchMovieList.map(e => {
                if (e.poster_path) {
                    return (
                        <div key={e.id}>
                            <div className="imgContainer">

                                <img src={`https://image.tmdb.org/t/p/w500` + e.poster_path} alt={e.title} key={e.id} />
                                <div className="blacker">
                                    <div className="desc">

                                        {e.overview}
                                        <br />
                                        <br />
                                        <p>Rating: {e.vote_average}/10</p>
                                        <div className="watchList">
                                            <a href="#" onClick={(j) => this.props.updateWatchList({ id: e.id, title: e.title }, j)}>Add to watchlist <strong>+</strong></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            })
        }

        return html
    }


    render() {
        return (
            <div className="movieDiv">
                {this.getSearchListHTML()}
            </div>
        )
    }
}

export default SearchedMovies;