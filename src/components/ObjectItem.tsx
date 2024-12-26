import React, { useState, useEffect, useRef } from 'react';
import { BoardObject } from '../models/BoardObject';

interface ObjectItemProps {
    object: BoardObject;
    onUpdate: (id: string, updatedObject: Partial<BoardObject>) => void;
    onDelete: (id: string) => void;
}

const ObjectItem: React.FC<ObjectItemProps> = ({ object, onUpdate, onDelete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [startWidth, setStartWidth] = useState(object.width);
    const [startHeight, setStartHeight] = useState(object.height);
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(object.text || '');

    const textRef = useRef<HTMLInputElement>(null);

    /** --- Перетаскивание --- **/
    const handleMouseDown = (e: React.MouseEvent) => {
        if (isEditing || isResizing) return;
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.clientX);
        setStartY(e.clientY);
        setOffsetX(object.x);
        setOffsetY(object.y);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            onUpdate(object.id, {
                x: offsetX + deltaX,
                y: offsetY + deltaY,
            });
        } else if (isResizing) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            onUpdate(object.id, {
                width: Math.max(50, startWidth + deltaX),
                height: Math.max(50, startHeight + deltaY),
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing]);

    /** --- Изменение размера --- **/
    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);
        setStartX(e.clientX);
        setStartY(e.clientY);
        setStartWidth(object.width);
        setStartHeight(object.height);
    };

    /** --- Редактирование текста --- **/
    const handleTextDoubleClick = () => {
        setIsEditing(true);
        setTimeout(() => textRef.current?.focus(), 0);
    };

    const handleTextBlur = () => {
        setIsEditing(false);
        onUpdate(object.id, { text });
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: object.y,
                left: object.x,
                width: object.width,
                height: object.height,
                backgroundColor: object.color || 'lightblue',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isEditing ? 'text' : 'move',
                userSelect: isEditing ? 'text' : 'none',
                border: '1px solid black',
                boxSizing: 'border-box',
                overflow: 'hidden', // Обрезка всего содержимого за пределами размеров объекта
            }}
            onMouseDown={handleMouseDown}
        >
            {isEditing ? (
                <input
                    ref={textRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleTextBlur}
                    style={{
                        width: '90%',
                        textAlign: 'center',
                        border: 'none',
                        outline: 'none',
                    }}
                />
            ) : (
                <div
                    onDoubleClick={handleTextDoubleClick}
                    style={{
                        padding: '10px',
                        textAlign: 'center',
                        wordWrap: 'break-word', // Перенос слов
                        overflow: 'hidden',
                        textOverflow: 'ellipsis', // Обрезка текста
                        display: '-webkit-box',
                        WebkitLineClamp: Math.floor(object.height / 16), // Примерная высота строки (16px)
                        WebkitBoxOrient: 'vertical',
                        pointerEvents: 'auto',
                    }}
                >
                    {text}
                </div>
            )}

            {/* Кнопка удаления */}
            <button
                onClick={() => onDelete(object.id)}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                ✖
            </button>

            {/* Угловой ползунок для изменения размера */}
            <div
                onMouseDown={handleResizeMouseDown}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '15px',
                    height: '15px',
                    cursor: 'nwse-resize',
                }}
            ></div>
        </div>
    );
};

export default ObjectItem;
