import React from 'react';
import './BlogIntro.css';

class BlogIntro extends React.Component{
    render() {
        return (
            <div>
                <h2 className="intro-line">
                	Welcome to Your Movie Reviews!
                    //This is Joe Bruin's <span className="emo">Emotional</span> Blog.
                </h2>
            </div>
        );
    }
}

export default BlogIntro;