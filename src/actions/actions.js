import _ from 'lodash';
import moment from "moment";
import { askModelForDslMeeting } from '../lib/gpt';

export const FETCH_EVENTS = 'fetch_events';
export const CREATE_EVENT = 'create_event';
export const UPDATE_EVENT = 'update_event';
export const DELETE_EVENT = 'delete_event';

export function fetchEvents() {
    if(!localStorage.getItem('events')) {
        localStorage.setItem('events', JSON.stringify([]));
    }
    const events = JSON.parse(localStorage.getItem('events'));
    const calendarEvents = events.map((event) => parseJSONEvent(event));
    return {
        type: FETCH_EVENTS,
        payload: calendarEvents
    }
}

export async function createEvent(prompt) {
    const newEvent = await askModelForDslMeeting(prompt, 'Karina');
    if (!newEvent) {
        console.log('Unable to create event from prompt: ', prompt);
        return;
    }

    const calendarEvent = parseGptEvent(newEvent);
    const events = JSON.parse(localStorage.getItem('events')) ?? [];
    events.push(calendarEvent);
    localStorage.setItem('events', JSON.stringify(events));
    window.dispatchEvent(new CustomEvent(CREATE_EVENT, { detail: calendarEvent }));
}

export function updateEvent(updatedEvent) {
    const events = JSON.parse(localStorage.getItem('events'));
    const index = _.findIndex(events, { 'id': updatedEvent.id});
    events[index] = updatedEvent;
    localStorage.setItem('events', JSON.stringify(events));
    const calendarEvents = events.map((event) => parseJSONEvent(event)); 
    return {
        type: UPDATE_EVENT,
        payload: calendarEvents
    }
}

export function deleteEvent(id) {
    const events = JSON.parse(localStorage.getItem('events'));
    const updatedEvents = events.filter((event) => event.id !== id);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    return {
        type: DELETE_EVENT,
        payload: events
    }
}

function parseGptEvent(gptEvent) {
    const attendees = gptEvent.ATTENDEES.split(', ');
    return {
        id: crypto.randomUUID(),
        title: gptEvent.TITLE,
        start: moment(gptEvent.START_TIME).toDate(),
        end: moment(gptEvent.START_TIME).add(gptEvent.DURATION, "minutes").toDate(),
        attendees: attendees,
        video: gptEvent.VIDEO,
    }
}

function parseJSONEvent(jsonEvent) {
    return {
        id: jsonEvent.id,
        title: jsonEvent.title,
        start: moment(jsonEvent.start).toDate(),
        end: moment(jsonEvent.end).toDate(),
        attendees: jsonEvent.attendees,
        video: jsonEvent.video
    }
}
