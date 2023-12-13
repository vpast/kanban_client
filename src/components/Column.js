import { Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task';
import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import isPropValid from '@emotion/is-prop-valid';

const Container = styled.div`
  height: ${(props) => props.dynamicHeight}px;
  width: 220px;
  box-shadow: 0px 1px 1px #091e4240, 0px 0px 1px #091e424f  ;
  border-radius: 10px;
  margin: 5px;
  background-color: #f1f2f4;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-weight: 600;
  padding: 8px;
`;

const TaskList = styled.div.withConfig({
  shouldForwardProp: (prop) => isPropValid(prop),
})`
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? 'lightsalmon' : '#f1f2f4'};
  flex-grow: 1;
  border-radius: 10px;
`;

const ButtonAdd = styled.button`
  background-color: rgb(12, 102, 228); /* Green */
  border: none;
  border-radius: 10px;
  color: white;
  padding: 12px;
  margin: 5px;
  margin-bottom: 7px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 208px;
  cursor: pointer;
`;

const ButtonAccept = styled.button`
  background-color: rgb(12, 102, 228); /* Green */
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

const TaskInput = styled.textarea`
  border-radius: 5px;
  width: 190px;
  height: 30px;
  padding: 8px;
  margin: 5px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  resize: none;
  height: auto;
  min-height: 30px;
  max-height: 300px;
`;

const Label = styled.label`
  font-weight: 600;
  display: flex;
  flex-direction: column;
`;

const LabelTitle = styled.p`
  color: black;
  padding: 8px;
`;

const Column = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [taskCount, setTaskCount] = useState(props.tasks.length);
  const [containerHeight, setContainerHeight] = useState(100);
  console.log(containerHeight);

  const updateListHeight = useCallback(() => {
    const totalTaskHeight = props.tasks.reduce(
      (total, task) => total + task.height,
      0
    );
    const newHeight = Math.max(90, totalTaskHeight + 20);
    setContainerHeight(newHeight);
  }, [props.tasks]);

  useEffect(() => {
    updateListHeight();
  }, [taskCount, updateListHeight]);

  // console.log(props.tasks.length);

  const autoExpandTextarea = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const handleInputChange = (event) => {
    setNewTask({ ...newTask, content: event.target.value });
    autoExpandTextarea(event.target);
  };

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
    setTaskCount((prevCount) => prevCount + 1);
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
    setTaskCount((prevCount) => Math.max(0, prevCount - 1));
  };

  return (
    <>
      <Draggable draggableId={props.column.id} index={props.index}>
        {(provided) => (
          <div>
            <Container
              {...provided.draggableProps}
              ref={provided.innerRef}
              $isModalOpen={showModal}
              $dynamicHeight={containerHeight}
            >
              <Title {...provided.dragHandleProps}>{props.column.title}</Title>
              <Droppable droppableId={props.column.id} type='task'>
                {(provided, snapshot) => (
                  <div className='flex'>
                    <TaskList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver}
                    >
                      {props.tasks.map((task, index) => (
                        <Task
                          key={task.id}
                          task={task}
                          index={index}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                      {provided.placeholder}
                    </TaskList>
                    <div>
                      <ButtonAdd onClick={() => setShowModal(true)}>
                        Add Task
                      </ButtonAdd>
                    </div>
                  </div>
                )}
              </Droppable>
            </Container>
            <div>
              {showModal && (
                <div className='modal'>
                  <Label>
                    <LabelTitle>New Task:</LabelTitle>
                    <TaskInput
                      type='text'
                      value={newTask.content}
                      onChange={handleInputChange}
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
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Column;
