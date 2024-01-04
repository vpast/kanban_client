import { Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task';
import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Title,
  TaskList,
  ButtonAdd,
  ButtonAccept,
  ButtonDecline,
  Label,
  LabelTitle,
  TaskInput,
  Modal,
  RenameButton,
  TitleFlex,
  RenameFlex,
} from '../css/StyledComponents';

const Column = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [taskCount, setTaskCount] = useState(props.tasks.length);
  const [containerHeight, setContainerHeight] = useState(100);
  const [isEditing, setIsEditing] = useState(false);
  const [newColumnName, setNewColumnName] = useState({ title: '' });

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

  const handleTitleInputChange = (event) => {
    setNewColumnName(event.target.value);
    console.log(newColumnName);
    // autoExpandTextarea(event.target);
  };

  const handleTaskInputChange = (event) => {
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
    updateListHeight();
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

    updateListHeight();
  };

  const handleRenameColumn = () => {
    setIsEditing(true);
    setNewColumnName(props.column.title);
  };

  const handleAcceptRename = () => {
    props.updateData((prevData) => ({
      ...prevData,
      columns: {
        ...prevData.columns,
        [props.column.id]: {
          ...prevData.columns[props.column.id],
          title: newColumnName,
        },
      },
    }));

    setIsEditing(false);
    setNewColumnName('');
  };

  const handleDeclineRename = () => {
    setIsEditing(false);
    setNewColumnName('');
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
              <TitleFlex {...provided.dragHandleProps}>
                {isEditing ? (
                  <RenameFlex>
                    <TaskInput
                      type='text'
                      value={newColumnName}
                      placeholder='New Title'
                      onChange={handleTitleInputChange}
                    />
                    <div className='buttonsPlacement'>
                      <ButtonAccept onClick={handleAcceptRename}>
                        Edit
                      </ButtonAccept>
                      <ButtonDecline onClick={handleDeclineRename}>
                        Back
                      </ButtonDecline>
                    </div>
                  </RenameFlex>
                ) : (
                  <>
                    <Title>{props.column.title}</Title>
                    <RenameButton onClick={handleRenameColumn}>
                      Edit
                    </RenameButton>
                  </>
                )}
              </TitleFlex>
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
                <Modal>
                  <Label>
                    <LabelTitle>New Task :</LabelTitle>
                    <TaskInput
                      type='text'
                      value={newTask.content}
                      onChange={handleTaskInputChange}
                      placeholder='Your Task'
                    />
                  </Label>
                  <div className='buttonsPlacement'>
                    <ButtonAccept onClick={handleAddTask}>Add</ButtonAccept>
                    <ButtonDecline onClick={() => setShowModal(false)}>
                      Back
                    </ButtonDecline>
                  </div>
                </Modal>
              )}
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Column;
