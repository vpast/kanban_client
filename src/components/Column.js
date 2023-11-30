import { Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task';
import styled from 'styled-components';

const Container = styled.div`
  width: 220px;
  border: 1px solid rgb(0, 0, 0);
  border-radius: 2px;
  margin: 5px;
  background-color: grey;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-weight: 600;
  padding: 8px;
`;

const TaskList = styled.div`
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? 'lightsalmon' : 'grey'};
  flex-grow: 1;
`;

const Column = (props) => {
  return (
    <>
      <Draggable draggableId={props.column.id} index={props.index}>
        {(provided) => (
          <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
          >
            <Title {...provided.dragHandleProps}>{props.column.title}</Title>
            <Droppable droppableId={props.column.id} type='task'>
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {props.tasks.map((task, index) => (
                    <Task key={task.id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          </Container>
        )}
      </Draggable>
    </>
  );
};

export default Column;
