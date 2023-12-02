import { Draggable } from '@hello-pangea/dnd';
import styled from 'styled-components';

const TaskContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Task = (props) => {
  const { task, index, onDelete } = props;

  const handleDeleteTask = () => {
    // console.log('Deleting task with ID:', task.id);
    onDelete(task.id);
  };

  return (
    <>
      <Draggable
        draggableId={task?.id}
        index={index}
        className='containerTaskBox'
      >
        {(provided) => (
          <TaskContainer
            className='containerTaskBoxTask'
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div>{task?.content}</div>
            <button onClick={handleDeleteTask}>&times;</button>
          </TaskContainer>
        )}
      </Draggable>
    </>
  );
};

export default Task;
