import { Draggable } from '@hello-pangea/dnd';
import {
  TaskContainer,
  TaskContent,
  DeleteButton,
} from '../css/StyledComponents';

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
            <TaskContent>{task?.content}</TaskContent>
            <DeleteButton onClick={handleDeleteTask}>&times;</DeleteButton>
          </TaskContainer>
        )}
      </Draggable>
    </>
  );
};

export default Task;
