import React, { useState, useEffect } from 'react';
import { BoardObject } from '@/models/BoardObject';
import ObjectItem from './ObjectItem';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'board_objects';

const Board: React.FC = () => {
    const [objects, setObjects] = useState<BoardObject[]>(() => {
        const savedObjects = localStorage.getItem(LOCAL_STORAGE_KEY);
        try {
            return savedObjects ? JSON.parse(savedObjects) : [];
        } catch (error) {
            console.error('Ошибка при парсинге localStorage:', error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(objects));
    }, [objects]);

    const addObject = (type: BoardObject['type']) => {
        setObjects((prev) => [
            ...prev,
            {
                id: uuidv4(),
                type,
                x: 50,
                y: 50,
                width: 100,
                height: 100,
                text: type === 'text' ? 'Text Object' : '',
                color: 'skyblue',
            },
        ]);
    };

    const updateObject = (id: string, updatedObject: Partial<BoardObject>) => {
        setObjects((prev) =>
            prev.map((obj) => (obj.id === id ? { ...obj, ...updatedObject } : obj))
        );
    };

    const deleteObject = (id: string) => {
        setObjects((prev) => prev.filter((obj) => obj.id !== id));
    };

    return (
        <div
            id="board"
            style={{
                position: 'relative',
                width: '100%',
                height: '90vh',
                border: '1px solid gray',
                overflow: 'hidden',
            }}
        >
            <div style={{ marginBottom: '10px' }}>
                <button onClick={() => addObject('rectangle')}>Add Rectangle</button>
                <button onClick={() => addObject('circle')}>Add Circle</button>
                <button onClick={() => addObject('text')}>Add Text</button>
            </div>
            {objects.map((object) => (
                <ObjectItem
                    key={object.id}
                    object={object}
                    onUpdate={updateObject}
                    onDelete={deleteObject}
                />
            ))}
        </div>
    );
};

export default Board;
