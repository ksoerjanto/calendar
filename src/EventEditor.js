import { useState } from 'react';
import moment from 'moment';

import "./styles/event-editor.css";

export default function EventEditor({ event, onClose, onSave }) {
    const [newEvent, setNewEvent] = useState(event);

    const handleSave = () => {
        onSave(newEvent);
    };

    return (
        <div className="event-editor">
            <div className="editor-header">Edit Event</div>
            <div className="field-editor">
                <label>Title:</label>
                <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
            </div>
            <div className="field-editor">
                <label>Start:</label>
                <input
                    type="time"
                    value={moment(newEvent.start).format('HH:mm')}
                    onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        setNewEvent({
                            ...newEvent,
                            start: new Date(newEvent.start).setHours(hours, minutes),
                        });
                    }
                    }
                />
            </div>
            <div className="field-editor">
                <label>End:</label>
                <input
                    type="time"
                    value={moment(newEvent.end).format('HH:mm')}
                    onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        setNewEvent({ ...newEvent, end: new Date(newEvent.end).setHours(hours, minutes) })
                    }
                    }
                />
            </div>
            <div className="button-group">
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}
