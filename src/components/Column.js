import { Droppable } from '@hello-pangea/dnd';
import Task from './Task'

const Column = (props) => {

  return (
    <>
      <div className='container'>
        <p>{props.column.title}</p>
        <Droppable droppableId={props.column.id}>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {props.tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </>
  );
};

export default Column;
