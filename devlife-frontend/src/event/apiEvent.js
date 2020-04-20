export const create = (userId, token, event) => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: event
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const list = page => {
    return fetch(`${process.env.REACT_APP_API_URL}/events/?page=${page}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const singleEvent = eventId => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const eventsByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/events/by/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const remove = (eventId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const update = (eventId, token, event) => {
    console.log(eventId, token, event);
    return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: event
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const like = (userId, token, eventId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/like`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, eventId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const unlike = (userId, token, eventId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/unlike`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, eventId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const comment = (userId, token, eventId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, eventId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const uncomment = (userId, token, eventId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, eventId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
