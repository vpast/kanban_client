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
  // console.log('Rendering Column:', props.column.id, props.tasks);
  // console.log(props)
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [taskCount, setTaskCount] = useState(props.tasks.length);
  const [containerHeight, setContainerHeight] = useState(100);
  const [isEditing, setIsEditing] = useState(false);
  const [newColumnName, setNewColumnName] = useState({ title: '' });

  // console.log(props.tasks)

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
      // Отправляем новую задачу на сервер
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

      //   let taskId = 'task-' + Date.now();
      //   prevData['tasks'][taskId] = {
      //     id: taskId,
      //     content: newTask.content,
      //   };
      //   prevData['columns'][props.column.id]['taskIds'].push(taskId);
      //   console.log(prevData);
      //   return prevData;
      // });

      
      props.updateData((prevData) => {
        console.log(prevData)
        const updatedTaskIds = [
          ...(prevData.columns[props.column.id]?.taskIds || []),
          result.task.id,
        ];

        return {
          ...prevData,
          tasks: {
            ...prevData.tasks,
            [result.task.id]: result.task,
          },
          columns: {
            ...prevData.columns,
            [props.column.id]: {
              ...prevData.columns[props.column.id],
              taskIds: updatedTaskIds,
            },
          },
        };
      });

      setNewTask({ content: '' });
      setTaskCount((prevCount) => prevCount + 1);
      setShowModal(false);
      updateListHeight();
      props.fetchTasksData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
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
