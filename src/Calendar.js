import { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import Modal from 'react-modal';
import EventEditor from './EventEditor';
import moment from "moment";
import 'moment-timezone';
import { CREATE_EVENT, deleteEvent, fetchEvents, updateEvent } from "./actions/actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEdit, faTrash, faUsers, faVideo } from '@fortawesome/free-solid-svg-icons';

import "./styles/calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.tz.setDefault('America/Los_Angeles');
const localizer = momentLocalizer(moment);
const dateOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
};

export default function Calendar() {
    const [events, setEvents] = useState(() => {
        return fetchEvents().payload;
    });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);

    useEffect(() => {
        const handleNewEvent = (event) => {
            setEvents([...events, event.detail]);
        };

        window.addEventListener(CREATE_EVENT, handleNewEvent);
        return () => window.removeEventListener(CREATE_EVENT, handleNewEvent);
    }, [events]);

    // useEffect(() => {
    //     // clean up local storage on component unmount.
    //     return () => {
    //         localStorage.clear();
    //     };
    // }, []);

    const onSelectEventHandler = (event) => {
        setSelectedEvent(event);
        setIsEventDetailModalOpen(true);
    }

    const formatEventTime = () => {
        if (!selectedEvent) {
            return;
        }

        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

        const startTime = selectedEvent.start.toLocaleTimeString([], timeOptions);
        const endTime = selectedEvent.end.toLocaleTimeString([], timeOptions);

        return `${startTime} - ${endTime}`;
    }

    const closeEventDetailModal = () => {
        setIsEventDetailModalOpen(false);
    };

    const closeEditorModal = () => {
        setIsEditorModalOpen(false);
        setSelectedEvent(null);
    }

    const onEditorOpened = () => {
        setIsEditorModalOpen(true);
        closeEventDetailModal();
    }

    const handleEditEvent = (event) => {
        const updatedEvents = updateEvent(event).payload;
        setEvents(updatedEvents);
        closeEditorModal();
    }

    const handleDeleteEvent = () => {
        if (!selectedEvent) {
            return;
        }
        deleteEvent(selectedEvent.id)
        setEvents(currentEvents => {
            return currentEvents.filter(event => event.id !== selectedEvent.id)
        });
        setSelectedEvent(null);
        closeEventDetailModal();
    }

    return (
        events && (
            <>
                <BigCalendar
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="week"
                    events={events}
                    onSelectEvent={(event) => onSelectEventHandler(event)}
                    step={60}
                    timeslots={1}
                    views={['day', 'week']}
                />
                {selectedEvent && (
                    <><Modal
                        isOpen={isEventDetailModalOpen}
                        onRequestClose={closeEventDetailModal}
                        className="event-modal"
                        overlayClassName="overlay">
                        <div className="event-header">
                            <div className="action-buttons">
                                <button className="action-button" onClick={onEditorOpened}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button className="action-button" onClick={handleDeleteEvent}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <button className="action-button" onClick={closeEventDetailModal}>
                                    <FontAwesomeIcon icon={faClose} />
                                </button>
                            </div>
                            {selectedEvent.title}
                        </div>
                        <div className="event-body">
                            <span>{selectedEvent.start.toLocaleDateString('en-US', dateOptions)}</span>
                            <span>&#x2022;</span>
                            <span>{formatEventTime()}</span>
                            {selectedEvent.attendees && (
                                <div className="event-attendees">
                                    <span>
                                        <FontAwesomeIcon className="icon" icon={faUsers} />
                                        Attendees:
                                    </span>
                                    <div className="attendees-list">
                                        {selectedEvent.attendees.map(attendee => {
                                            return (
                                                <div key={attendee} >&#x2022; {attendee}</div>
                                            );
                                        })}
                                    </div>
                                </div>)}
                            {selectedEvent.video !== 'NONE' && (
                                <span>
                                    <FontAwesomeIcon className="icon" icon={faVideo} />
                                    {selectedEvent.video}
                                </span>
                            )}
                        </div>
                    </Modal>
                    <Modal
                        isOpen={isEditorModalOpen}
                        onRequestClose={closeEventDetailModal}
                        className="event-modal"
                        overlayClassName="overlay"
                        >
                            <EventEditor
                                event={selectedEvent}
                                onClose={closeEditorModal}
                                onSave={handleEditEvent} />
                    </Modal></>
                )}
            </>
        )
    );
}
