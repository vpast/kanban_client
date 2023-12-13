import { Draggable } from '@hello-pangea/dnd';
import styled from 'styled-components';

const TaskContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const TaskContent = styled.div`
  flex-grow: 1;
  word-wrap: break-word;
  white-space: pre-line;
  overflow-wrap: break-word;
  min-height: 20px; /* Минимальная высота, чтобы не сворачивался в пустом состоянии */
  overflow: hidden;
  margin-right: 30px;
`;

const DeleteButton = styled.button`
  display: none; /* Начально скрываем кнопку */
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: black;
  position: absolute;
  right: 8px; /* Располагаем крестик справа с отступом */
  top: 50%; /* По середине вертикали */
  transform: translateY(-50%);

  /* Добавляем стили при наведении на задачу */
  ${TaskContainer}:hover & {
    display: block; /* Показываем кнопку при наведении */
  }
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
            <TaskContent>{task?.content}</TaskContent>
            <DeleteButton onClick={handleDeleteTask}>&times;</DeleteButton>
          </TaskContainer>
        )}
      </Draggable>
    </>
  );
};

export default Task;
