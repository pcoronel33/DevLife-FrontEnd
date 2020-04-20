import React, { Component } from "react";
import { singleEvent, update } from "./apiEvent";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import DefaultEvent from "../images/test2.jpg";

class EditEvent extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            title: "",
            body: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false
        };
    }

    init = eventId => {
        singleEvent(eventId).then(data => {
            if (data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({
                    id: data.postedBy._id,
                    title: data.title,
                    body: data.body,
                    error: ""
                });
            }
        });
    };

    componentDidMount() {
        this.eventData = new FormData();
        const eventId = this.props.match.params.eventId;
        this.init(eventId);
    }

    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 1000000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            });
            return false;
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        const value = name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.eventData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const eventId = this.props.match.params.eventId;
            const token = isAuthenticated().token;

            update(eventId, token, this.eventData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({
                        loading: false,
                        title: "",
                        body: "",
                        redirectToProfile: true
                    });
                }
            });
        }
    };

    editEventForm = (title, body) => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Event Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type='file'
                    accept='image/*'
                    className='form-control'
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Title</label>
                <input
                    onChange={this.handleChange("title")}
                    type='text'
                    className='form-control'
                    value={title}
                />
            </div>

            <div className='form-group'>
                <label className='text-muted'>Body</label>
                <textarea
                    onChange={this.handleChange("body")}
                    type='text'
                    className='form-control'
                    value={body}
                />
            </div>

            <button onClick={this.clickSubmit} className='btn btn-raised btn-primary'>
                Update Event
      </button>
        </form>
    );

    render() {
        const { id, title, body, redirectToProfile, error, loading } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
        }

        return (
            <div className='container'>
                <h2 className='mt-5 mb-5'>{title}</h2>

                <div
                    className='alert alert-danger'
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                {loading ? (
                    <div className='jumbotron text-center'>
                        <h2>Loading...</h2>
                    </div>
                ) : (
                        ""
                    )}

                <img
                    style={{ height: "auto", width: "auto" }}
                    className='img-thumbnail'
                    src={`${
                        process.env.REACT_APP_API_URL
                        }/event/photo/${id}?${new Date().getTime()}`}
                    onError={i => (i.target.src = `${DefaultEvent}`)}
                    alt={title}
                />

                {isAuthenticated().user.role === "admin" &&
                    this.editEventForm(title, body)}

                {isAuthenticated().user._id === id && this.editEventForm(title, body)}
            </div>
        );
    }
}

export default EditEvent;
