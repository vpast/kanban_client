import { Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task';
import styled from 'styled-components';
import { useState } from 'react';

const Container = styled.div`
  height: ${(props) => (props.isModalOpen ? '300px' : '200px')};
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

const ButtonAdd = styled.button`
  background-color: #04aa6d; /* Green */
  border: none;
  border-radius: 5px;
  color: white;
  padding: 8px;
  margin: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 210px;
  cursor: pointer;
`;

const ButtonAccept = styled.button`
  background-color: #04aa6d; /* Green */
  border: none;
  border-radius: 5px;
  color: white;
  padding: 8px;
  margin: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 100px;
  cursor: pointer;
`;

const ButtonDecline = styled.button`
  background-color: #fc4949; /* Green */
  border: none;
  border-radius: 5px;
  color: white;
  padding: 8px;
  margin: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 100px;
  cursor: pointer;
`;

const TaskInput = styled.input`
  border-radius: 5px;
  width: 190px;
  height: 30px;
  padding: 8px;
  margin: 5px;
`;

const Label = styled.label`
  font-weight: 600;
  display: flex;
  flex-direction: column;
`;

const LabelTitle = styled.p`
  padding: 8px;
`;

const Column = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  // console.log(props.column)

  const handleAddTask = () => {
    if (!props.tasks) {
      console.error('Data is undefined.');
      return;
    }

    props.updateData((prevData) => ({
      ...prevData,
      tasks: {
        ...prevData.tasks,
        [`task-${Date.now()}`]: {
          id: `task-${Date.now()}`,
          content: newTask.content,
        },
      },
      columns: {
        ...prevData.columns,
        [props.column.id]: {
          ...prevData.columns[props.column.id],
          taskIds: [
            ...prevData.columns[props.column.id].taskIds,
            `task-${Date.now()}`,
          ],
        },
      },
    }));

    setNewTask({ content: '' });
    setShowModal(false);
  };

  const handleDeleteTask = (taskId) => {
    // console.log('Deleting task with ID:', taskId);

    // console.log('Calling updateData in Column.js with tasks and column:', props.tasks, props.column);
    if (!props.tasks) {
      console.error('Data is undefined.');
      return;
    }

    const updatedTasks = { ...props.tasks };

    delete updatedTasks[taskId];

    props.updateData((prevData) => ({
      ...prevData,
      tasks: updatedTasks,
      columns: {
        ...prevData.columns,
        [props.column.id]: {
          ...prevData.columns[props.column.id],
          taskIds: prevData.columns[props.column.id].taskIds.filter(
            (id) => id !== taskId
          ),
        },
      },
    }));
  };

  return (
    <>
      <Draggable draggableId={props.column.id} index={props.index}>
        {(provided) => (
          <Container
            {...provided.draggableProps}
            ref={provided.innerRef}
            $isModalOpen={showModal}
          >
            <Title {...provided.dragHandleProps}>{props.column.title}</Title>
            <Droppable droppableId={props.column.id} type='task'>
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  $isDraggingOver={snapshot.isDraggingOver}
                >
                  {props.tasks.map(
                    (task, index) => (
                      (
                        <Task
                          key={task.id}
                          task={task}
                          index={index}
                          onDelete={handleDeleteTask}
                        />
                      )
                    )
                  )}
                  {provided.placeholder}
                  <ButtonAdd onClick={() => setShowModal(true)}>
                    Add Task
                  </ButtonAdd>

                  {showModal && (
                    <div className='modal'>
                      <Label>
                        <LabelTitle>New Task:</LabelTitle>
                        <TaskInput
                          type='text'
                          value={newTask.content}
                          onChange={(e) =>
                            setNewTask({ ...newTask, content: e.target.value })
                          }
                          placeholder='Your Task'
                        />
                      </Label>
                      <div className='buttonsPlacement'>
                        <ButtonAccept onClick={handleAddTask}>Add</ButtonAccept>
                        <ButtonDecline onClick={() => setShowModal(false)}>
                          Back
                        </ButtonDecline>
                      </div>
                    </div>
                  )}
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
