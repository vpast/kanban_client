import { Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task';
import { useState, useEffect, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import {
  Container,
  Title,
  TaskList,
  ButtonAdd,
  ButtonAccept,
  ButtonDecline,
  ButtonDeleteList,
  Label,
  LabelTitle,
  Modal,
  RenameButton,
  TitleFlex,
  RenameFlex,
} from '../css/StyledComponents';
import styled from 'styled-components';

const TaskButtonAdd = styled(ButtonAdd)`
  display: ${(props) => (props.isColumnEditing ? 'none' : 'block')};
  margin-top: auto;
`;

const Column = (props) => {
  // console.log('Rendering Column:', props.column.id, props.tasks);
  // console.log(props.column.title)
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [taskCount, setTaskCount] = useState(props.tasks.length);
  const [containerHeight, setContainerHeight] = useState(100);
  const [isEditing, setIsEditing] = useState(false);
  const [isColumnListEditing, setIsColumnListEditing] = useState(false);
  const [newColumnName, setNewColumnName] = useState({ title: '' });

  // console.log(props.tasks)

  const updateListHeight = useCallback(() => {
    const taskHeight = 50;
    const totalTaskHeight = props.tasks.length * taskHeight;
    const newHeight = Math.max(90, totalTaskHeight + 20);
    setContainerHeight(newHeight);
  }, [props.tasks]);

  useEffect(() => {
    updateListHeight();
  }, [taskCount, updateListHeight]);

  // console.log(props.tasks.length);

  // const autoExpandTextarea = (textarea) => {
  //   textarea.style.height = 'auto';
  //   textarea.style.height = textarea.scrollHeight + 'px';
  // };

  const handleTitleInputChange = (event) => {
    setNewColumnName(event.target.value);
  };

  const handleRenameColumn = () => {
    setIsEditing(true);
    setNewColumnName(props.column.title);
  };

  const handleAcceptRename = async () => {
    try {
      const response = await fetch('http://localhost:5000/updateColumnTitle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: props.column.id, // ID колонки, которую нужно обновить
          title: newColumnName, // Новый заголовок колонки
        }),
      });

      const result = await response.json();

      props.updateColumnTitle(result, props.column.id);
    } catch (error) {
      console.error('Error adding task:', error);
    }

    setIsEditing(false);
    setNewColumnName('');
  };

  const handleDeclineRename = () => {
    setIsEditing(false);
    setNewColumnName('');
  };

  const handleTaskInputChange = (event) => {
    setNewTask({ ...newTask, content: event.target.value });
  };

  const handleAddTask = async () => {
    if (!props.tasks) {
      console.error('Data is undefined.');
      return;
    }

    const taskId = 'task-' + Date.now();
    const newTaskObject = {
      id: taskId,
      content: newTask.content,
    };

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: newTaskObject,
          columnId: props.column.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const result = await response.json();

      props.onAddTask(result, props.column.id);

      setNewTask({ content: '' });
      setTaskCount((prevCount) => prevCount + 1);
      setShowModal(false);
      setIsColumnListEditing(false);
      updateListHeight();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!props.tasks) {
      console.error('Data is undefined.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/tasks/${taskId}?columnId=${props.column.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      props.onDeleteTask(taskId, props.column.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }

    setTaskCount((prevCount) => Math.max(0, prevCount - 1));
    updateListHeight();
  };

  const handleDeleteList = async () => {
    if (!props.column) {
      console.error('Data is undefined.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/columns/${props.column.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete column: ${response.statusText}`);
      }

      props.onDeleteList(props.column.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }

    setIsEditing(false);
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
                    <TextareaAutosize
                      className='textAreaAutoSizeColumn'
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
                    <ButtonDeleteList onClick={handleDeleteList}>
                      Delete List
                    </ButtonDeleteList>
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
                      {props.tasks.map((task, index) => {
                        // console.log(task)
                        return (
                          <Task
                            key={task.id}
                            task={task}
                            index={index}
                            onDelete={handleDeleteTask}
                          />
                        );
                      })}
                      {provided.placeholder}
                    </TaskList>
                    <div></div>
                  </div>
                )}
              </Droppable>
              <TaskButtonAdd
                isColumnEditing={isColumnListEditing}
                onClick={() => {
                  setShowModal(true);
                  setIsColumnListEditing(true);
                }}
              >
                Add Task
              </TaskButtonAdd>
            </Container>
            <div>
              {showModal && (
                <Modal>
                  <Label>
                    <LabelTitle>New Task :</LabelTitle>
                    <TextareaAutosize
                      className='textAreaAutoSizeColumn'
                      minRows={3}
                      placeholder='Your Task'
                      value={newTask.content}
                      onChange={handleTaskInputChange}
                    />
                  </Label>
                  <div className='buttonsPlacement'>
                    <ButtonAccept onClick={handleAddTask}>Add</ButtonAccept>
                    <ButtonDecline
                      onClick={() => {
                        setShowModal(false);
                        setIsColumnListEditing(false);
                      }}
                    >
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
