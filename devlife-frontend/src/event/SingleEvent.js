import React, { Component } from "react";
import { singleEvent, remove, like, unlike } from "./apiEvent";
import DefaultEvent from "../images/mountains.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Comment from "./EventComment";

class SingleEvent extends Component {
  state = {
    event: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: []
  };

  checkLike = likes => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount = () => {
    const eventId = this.props.match.params.eventId;
    singleEvent(eventId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          event: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
        });
      }
    });
  };

  updateComments = comments => {
    this.setState({ comments });
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const eventId = this.state.event._id;
    const token = isAuthenticated().token;

    callApi(userId, token, eventId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length
        });
      }
    });
  };

  deleteEvent = () => {
    const eventId = this.props.match.params.eventId;
    const token = isAuthenticated().token;
    remove(eventId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your event?");
    if (answer) {
      this.deleteEvent();
    }
  };

  renderEvent = event => {
    const posterId = event.postedBy ? `/user/${event.postedBy._id}` : "";
    const posterName = event.postedBy ? event.postedBy.name : " Unknown";

    const { like, likes } = this.state;

    return (
      <div className='card-body'>
        <img
          src={`${process.env.REACT_APP_API_URL}/event/photo/${event._id}`}
          alt={event.title}
          onError={i => (i.target.src = `${DefaultEvent}`)}
          className='img-thunbnail mb-3'
          style={{
            height: "auto",
            width: "100%",
            objectFit: "cover"
          }}
        />

        {like ? (
          <h3 onClick={this.likeToggle}>
            <i
              className='fa fa-thumbs-up text-success bg-dark'
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} Like
          </h3>
        ) : (
          <h3 onClick={this.likeToggle}>
            <i
              className='fa fa-thumbs-up text-warning bg-dark'
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} Like
          </h3>
        )}

        <p className='card-text'>{event.body}</p>
        <br />
        <p className='font-italic'>
          Posted by <Link to={`${posterId}`}>{posterName} </Link>
          on {new Date(event.created).toDateString()}
        </p>
        <div className='d-inline-block'>
          <Link to={`/`} className='btn btn-raised btn-primary btn-sm mr-5'>
            Back to events
          </Link>

          {isAuthenticated().user &&
            isAuthenticated().user._id === event.postedBy._id && (
              <>
                <Link
                  to={`/event/edit/${event._id}`}
                  className='btn btn-raised btn-warning btn-sm mr-5'
                >
                  Update Event
                </Link>
                <button
                  onClick={this.deleteConfirmed}
                  className='btn btn-raised btn-danger btn-sm mr-5'
                >
                  Delete Event
                </button>
              </>
            )}

          <div>
            {isAuthenticated().user && isAuthenticated().user.role === "admin" && (
              <div class='card mt-5'>
                <div className='card-body'>
                  <h5 className='card-title'>Admin</h5>
                  <p className='mb-2 text-danger'>Edit/Delete as an Admin</p>
                  <Link
                    to={`/event/edit/${event._id}`}
                    className='btn btn-raised btn-warning btn-sm mr-5'
                  >
                    Update Event
                  </Link>
                  <button
                    onClick={this.deleteConfirmed}
                    className='btn btn-raised btn-danger'
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { event, redirectToHome, redirectToSignin, comments } = this.state;

    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <div className='container'>
        <h2 className='display-2 mt-5 mb-5'>{event.title}</h2>

        {!event ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderEvent(event)
        )}

        <Comment
          eventId={event._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}

export default SingleEvent;
