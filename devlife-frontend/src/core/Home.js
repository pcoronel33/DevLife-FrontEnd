import React from "react";
import Posts from "../post/Posts";
import Events from "../event/Events";

const Home = () => (
  <div>
    <div className='container'>
      <div className='jumbotron'>
        <h2>DevLife</h2>
        <p className='lead'>A healthy social network for developers</p>
      </div>
    </div>
    <div className="container">
      <Posts />
    </div>
    <div className="container">
      <Events />
    </div>
  </div>
);


export default Home;
