import React from 'react';

export const fetchAllEvents = () => {
  let [events, setEvent] = React.useState('');

  fetch("http://vmi527256.contaboserver.net:3000/GetAllEvents", {
  //fetch("https://quotes15.p.rapidapi.com/quotes/random/", {
    "method": "GET",
    "headers": {
      "uid": "1"
    }
  })
    .then(response => response.json())
    .then(response => {
      setEvent(response.data);
      //setEvent(response.message);
    })
    .catch(err => {
      console.log(err);
    });

    return events;
}