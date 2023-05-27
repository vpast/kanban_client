import { Draggable } from 'react-beautiful-dnd';
import Tasks from '../Tasks.json';
import Card from './Card';
import React from 'react';

const TaskList = React.forwardRef(() => {
  // if (props.id.id === undefined) {
  //   props.id.id = '0';
  //   console.log(props.id.id);
  // }
  return (
    <>
      {Tasks.map((item, index) => (
        <Draggable draggableId={item.id} index={index} key={item.id}>
          {(provided) => (
          
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div>
                {item.title}
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </>
  );
});

export default TaskList;
