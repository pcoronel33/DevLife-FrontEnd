import React, { Component } from "react";
import { list } from "../event/apiEvent";
import DefaultEvent from "../images/test2.jpg";
import { Link } from "react-router-dom";

class Events extends Component {
  constructor() {
    super();
    this.state = {
      events: [],
      page: 1
    };
  }

  loadEvents = page => {
    list(page).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ events: data });
      }
    });
  };
  componentDidMount() {
    this.loadEvents(this.state.page);
  }

  loadMore = number => {
    this.setState({ page: this.state.page + number });
    this.loadEvents(this.state.page + number);
  };

  loadLess = number => {
    this.setState({ page: this.state.page - number });
    this.loadEvents(this.state.page - number);
  };

  renderEvents = events => {
    return (
      <div className='row'>
        {events.map((event, i) => {
          const posterId = event.postedBy ? `/user/${event.postedBy._id}` : "";
          const posterName = event.postedBy ? event.postedBy.name : " Unknown";

          return (
            <div className='card bg-light col-md-4' key={i}>
              <div className='card-body'>
                <img
                  src={`${process.env.REACT_APP_API_URL}/event/photo/${event._id}`}
                  alt={event.title}
                  onError={i => (i.target.src = `${DefaultEvent}`)}
                  className='img-thunbnail mb-3'
                  style={{ height: "auto", width: "100%" }}
                />
                <h5 className='card-title'>{event.title}</h5>
                <p className='card-text'>{event.body.substring(0, 100)}</p>
                <br />
                <p className='font-italic'>
                  Posted by <Link to={`${posterId}`}>{posterName} </Link>
                  on {new Date(event.created).toDateString()}
                </p>
                <Link
                  to={`/event/${event._id}`}
                  className='btn btn-raised btn-danger btn-sm'
                >
                  Read more
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { events, page } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>
          {!events.length ? "No more events!" : "Recent Events"}
        </h2>

        {this.renderEvents(events)}

        {page > 1 ? (
          <button
            className='btn btn-raised btn-warning mr-5 mt-5 mb-5'
            onClick={() => this.loadLess(1)}
          >
            Previous ({this.state.page - 1})
          </button>
        ) : (
          ""
        )}

        {events.length ? (
          <button
            className='btn btn-raised btn-success mt-5 mb-5'
            onClick={() => this.loadMore(1)}
          >
            Next ({page + 1})
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Events;
