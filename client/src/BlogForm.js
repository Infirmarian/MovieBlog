import React from 'react';
import './BlogForm.css';
import * as api from './api';
import { runInThisContext } from 'vm';

//This is where user enters their data (popup where they specify movie, rating, etc)
// TODO: add BlogForm component

const initState = {
	movieTitle: '',
	movieReview: '',
	rating: 0,
	myToken: "ri5lb0bpukelqzhd2jd6gf"
}

class BlogForm extends React.Component{
	constructor(props) {
		super(props);
		this.state = initState;
	}

	updateTitle = (e) => {
		this.setState({
			movieTitle: e.target.value
		});
	}

	updateReview = (e) => {
		this.setState({
			movieReview: e.target.value
		});
	}

	updateRating = (e) => {
		this.setState({
			rating: e.target.value
		});
	}

	newPost = () => {
		const {movieTitle, movieReview, rating} = this.state;
		if(movieTitle === ''){
			alert('Title is empty');
			return;
		} 
		if (movieReview === ' ') {
			alert('Content is empty');
			return;
		}

		const newPost = {
			token: this.state.myToken,
			title: movieTitle, 
			body: movieReview,
			rating
		};

		try {
			api.addPost(newPost);
			this.props.onSend();
			this.setState(initState);
		} catch (err) {
			alert(err);
		}

	}

	isValidNumber(evt) 
	{
		var charCode = (evt.which) ? evt.which : evt.keyCode
		if (charCode >= 48 && charCode <= 53)
			return true;
		return false;
	}
	render() {
		const onFocusHidePH = (e) => { e.target.placeholder = ''; };
        const titlePH = 'Movie Title';
        const reviewPH = 'Add Review';
        const ratingPH = 'Rating (0-5)';
        const onBlurShowPH = (ph) => {
            return (e) => { e.target.placeholder = ph; };
        };
		return (
			<div>
				<div className="blog-form">
				<input
					className="title-in custom-in"
					placeholder={titlePH}
					onFocus={onFocusHidePH}
					onBlur={onBlurShowPH(titlePH)}
					onChange={this.updateTitle}
					value={this.state.movieTitle}
				/>
				<textarea
					className="review-in custom-in"
					placeholder={reviewPH}
					onFocus={onFocusHidePH}
					onBlur={onBlurShowPH(reviewPH)}
					rows="30"
					onChange={this.updateReview}
					value={this.state.movieReview}
				/>
				<input
					type="number"
					onkeypress="return isValidRating(event)"
					className="rating-in custom-in"
					placeholder={ratingPH}
					onFocus={onFocusHidePH}
					onBlur={onBlurShowPH(ratingPH)}
					onChange={this.updateRating}
					value={this.state.rating}
				/>
				<button
					className="send-btn"
					onClick={this.newPost}>
					Send!
				</button>
				</div>
			</div>
		)
	}
}
export default BlogForm;
