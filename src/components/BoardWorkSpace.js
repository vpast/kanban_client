import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './Column';
// import Tasks from '../Tasks';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  AddListButton,
  Label,
  LabelTitle,
  TaskInput,
  ButtonAccept,
  ButtonDecline,
  Modal,
} from '../css/StyledComponents';

const Container = styled.div`
  display: flex;
`;

const BoardWorkSpace = () => {
  const [state, setState] = useState({ columns: {}, columnOrder: [] });
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddButtonVisible, setAddButtonVisible] = useState(true);
  const [columnsData, setColumnsData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  // const [columnOrder, setColumnOrder] = useState([]);

  const fetchColumnsData = () => {
    fetch('http://localhost:5000/columns')
      .then((res) => res.json())
      .then((data) => {
        setColumnsData(data);
      });
  };

  // columnsData.map((column) => console.log(column.id));

  const fetchTasksData = () => {
    fetch('http://localhost:5000/tasks')
      .then((res) => res.json())
      .then((data) => {
        const tasks = {};
        data.forEach((task) => {
          tasks[task.id] = task; // Преобразование массива задач в объект для удобного доступа по id
        });
        setState((prevState) => ({
          ...prevState,
          tasks: tasks,
        }));
        setTasksData(data);
      });
  };

  useEffect(() => {
    fetchColumnsData();
    fetchTasksData();
  }, []);

  // console.log(tasksData);
  // console.log(columnsData);

  let onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...state,
        columnOrder: newColumnOrder,
      };
      setState(newState);
      return;
    }

    const columnStart = state.columns[source.droppableId];
    const columnFinish = state.columns[destination.droppableId];

    if (columnStart === columnFinish) {
      const newTaskIds = Array.from(columnStart.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...columnStart,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    const startTaskIds = Array.from(columnStart.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...columnStart,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(columnFinish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...columnFinish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setState(newState);
  };

  // const updateState = (newState) => {
  //   console.log(state, newState)
  //   setState({...newState});
  // };

  const handleNewAddListTitle = (event) => {
    setNewListTitle(event.target.value);
  };

  const handleAddList = () => {

    setShowAddListModal(false);
    setNewListTitle('');
  };

  const onUpdateColumnTitle = (newTitle, columnId) => {
    setColumnsData((prevData) => {
      const { title: newColumnTitle } = newTitle;
      const updateColumnTitle = newColumnTitle;

      return prevData.map((item) => {
        if (item.id === columnId) {
          return {
            ...item,
            title: updateColumnTitle,
          };
        }
        console.log(item);
        return item;
      });
    });
  };

  const onUpdateTasksData = (newTask, columnId) => {
    setColumnsData((prevData) => {
      const { id: newTaskId } = newTask.task;
      const columnData = prevData.find((item) => item.id === columnId);
      const { taskIds = [] } = columnData;
      const updateTaskIds = [...taskIds, newTaskId];

      return prevData.map((item) => {
        if (item.id === columnId) {
          return {
            ...item,
            taskIds: updateTaskIds,
          };
        }
        return item;
      });
    });
    setTasksData((prevData) => [...prevData, newTask.task]);
  };

  return (
    <>
      <div className='workSpacePadding'>
        <div className='workSpaceCard'>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId='all-columns'
              direction='horizontal'
              type='column'
            >
              {(provided) => (
                <div>
                  <Container
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {columnsData.map((column, index) => {
                      if (!column || !column.taskIds) {
                        return [];
                      }

                      const tasks = tasksData.filter((task) => {
                        return column.taskIds.includes(task.id);
                      });

                      return (
                        <Column
                          key={column.id}
                          column={column}
                          tasks={tasks}
                          index={index}
                          updateTasks={onUpdateTasksData}
                          updateColumnTitle={onUpdateColumnTitle}
                          fetchTasksData={fetchTasksData}
                        />
                      );
                    })}
                    {provided.placeholder}
                    {showAddListModal && (
                      <div>
                        <Modal>
                          <Label>
                            <LabelTitle>New List :</LabelTitle>
                            <TaskInput
                              type='text'
                              value={newListTitle}
                              onChange={handleNewAddListTitle}
                              placeholder='List Title'
                            />
                          </Label>
                          <div className='buttonsPlacement'>
                            <ButtonAccept
                              onClick={() => {
                                handleAddList();
                                setAddButtonVisible(true);
                              }}
                            >
                              Add
                            </ButtonAccept>
                            <ButtonDecline
                              onClick={() => {
                                setShowAddListModal(false);
                                setAddButtonVisible(true);
                              }}
                            >
                              Back
                            </ButtonDecline>
                          </div>
                        </Modal>
                      </div>
                    )}
                  </Container>
                </div>
              )}
            </Droppable>
            <AddListButton
              isVisible={isAddButtonVisible}
              onClick={() => {
                setShowAddListModal(true);
                setAddButtonVisible(false);
              }}
            >
              Add List
            </AddListButton>
          </DragDropContext>
        </div>
      </div>
    </>
  );
};

export default BoardWorkSpace;
