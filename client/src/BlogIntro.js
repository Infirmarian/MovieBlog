import React from 'react';
import './BlogIntro.css';

class BlogIntro extends React.Component{
    render() {
        return (
            <div>
                <h2 className="intro-line">
                	Welcome to <span className="emo">YOUR</span> Movie Reviews!
                </h2>
            </div>
        );
    }
}

export default BlogIntro;