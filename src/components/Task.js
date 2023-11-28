import { Draggable } from '@hello-pangea/dnd';

const Task = (props) => {
  let check = () => {
    console.log(props.task.id);
  };
  return (
    <>
      <Draggable
        draggableId={props.task.id}
        index={props.index}
        className='containerTaskBox'
      >
        {(provided) => (
          <div
            className='containerTaskBoxTask'
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={check}
          >
            {props.task.content}
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Task;