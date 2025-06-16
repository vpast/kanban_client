import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './Column';
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import { API_URL } from '../config';
import {
  AddListButton,
  Label,
  LabelTitle,
  ButtonAccept,
  ButtonDecline,
  Modal,
} from '../css/StyledComponents';

const Container = styled.div`
  display: flex;
`;

const BoardWorkSpace = ({ boardsData, currentBoard, switchBoard }) => {
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddButtonVisible, setAddButtonVisible] = useState(true);
  const [columnsData, setColumnsData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [boardData, setBoardData] = useState(null);

  const fetchColumnsData = async () => {
    if (!currentBoard) return;
    
    try {
      const response = await fetch(`${API_URL}/columns`);
      const data = await response.json();
      
      const currentBoardData = boardsData.find(board => board._id === currentBoard);
      if (!currentBoardData) return;

      const boardColumns = data.filter(column => 
        currentBoardData.columns.includes(column._id)
      );
      setColumnsData(boardColumns);
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
  };

  const fetchBoardData = async () => {
    try {
      const response = await fetch(`${API_URL}/boards/${currentBoard}`);
      const data = await response.json();
      setBoardData(data);
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };

  const fetchTasksData = async () => {
    if (!currentBoard) return;

    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      
      const boardTasks = data.filter(task => 
        columnsData.some(column => column.taskIds.includes(task._id))
      );
      setTasksData(boardTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const updateBoardColumns = useCallback(async (newColumns) => {
    if (!boardData) return;

    try {
      const response = await fetch(`${API_URL}/boards/${boardData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          columns: newColumns
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update board');
      }

      const updatedBoard = await response.json();
      setBoardData(updatedBoard);
    } catch (error) {
      console.error('Error updating board columns:', error);
    }
  }, [boardData]);

  useEffect(() => {
    if (currentBoard) {
      fetchBoardData();
      fetchColumnsData();
    } else {
      setColumnsData([]);
      setTasksData([]);
      setBoardData(null);
    }
  }, [currentBoard]);

  useEffect(() => {
    if (currentBoard && columnsData.length > 0) {
      fetchTasksData();
    }
  }, [currentBoard, columnsData]);

  let onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    console.log(result);

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
      const newColumns = Array.from(boardData.columns);
      newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, draggableId);

      const optimisticBoardData = {
        ...boardData,
        columns: newColumns
      };
      setBoardData(optimisticBoardData);

      try {
        const response = await fetch(`${API_URL}/boards/${boardData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            columns: newColumns
          }),
        });
        
        if (!response.ok) {
          setBoardData(boardData);
          throw new Error('Failed to update board');
        }
      } catch (error) {
        console.error('Error updating board columns:', error);
        setBoardData(boardData);
      }
      return;
    }

    const columnStart = columnsData.find(
      (column) => column._id === source.droppableId
    );

    const columnFinish = columnsData.find(
      (column) => column._id === destination.droppableId
    );

    if (columnStart === columnFinish) {
      const newTaskIds = Array.from(columnStart.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const updatedColumn = {
        ...columnStart,
        taskIds: newTaskIds,
      };

      setColumnsData((prevData) =>
        prevData.map((col) =>
          col._id === updatedColumn._id ? updatedColumn : col
        )
      );

      try {
        await fetch(`${API_URL}/columns/${updatedColumn._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            column: updatedColumn,
          }),
        });
      } catch (error) {
        console.error('Error updating column:', error);
      }
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

    setColumnsData((prevData) =>
      prevData.map((col) =>
        col._id === newStart._id
          ? newStart
          : col._id === newFinish._id
          ? newFinish
          : col
      )
    );

    try {
      await fetch(`${API_URL}/columns/${newStart._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ column: newStart }),
      });

      await fetch(`${API_URL}/columns/${newFinish._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ column: newFinish }),
      });
    } catch (error) {
      console.error('Error updating columns:', error);
    }
  };

  const handleNewAddListTitle = (event) => {
    setNewListTitle(event.target.value);
  };

  const handleAddList = async () => {
    const newColumnObject = {
      title: newListTitle,
      taskIds: [],
    };

    try {
      const response = await fetch(`${API_URL}/columns/column`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          column: newColumnObject,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add column');
      }

      const result = await response.json();
      console.log(result);

      setColumnsData((prevData) => [...prevData, result.column]);
      
      const newColumns = [...boardData.columns, result.column._id];
      updateBoardColumns(newColumns);
    } catch (error) {
      console.error('Error adding column:', error);
    }

    setShowAddListModal(false);
    setNewListTitle('');
  };

  const onUpdateColumnTitle = (newTitle, columnId) => {
    setColumnsData((prevData) => {
      const { title: newColumnTitle } = newTitle;
      const updateColumnTitle = newColumnTitle;

      return prevData.map((item) => {
        if (item._id === columnId) {
          return {
            ...item,
            title: updateColumnTitle,
          };
        }
        return item;
      });
    });
  };

  const onAddTask = (newTask, columnId) => {
    setColumnsData((prevData) => {
      const { _id: newTaskId } = newTask.task;
      const columnData = prevData.find((item) => item._id === columnId);
      const { taskIds = [] } = columnData;
      const updateTaskIds = [...taskIds, newTaskId];

      return prevData.map((item) => {
        if (item._id === columnId) {
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

  const onDeleteTask = (taskId, columnId) => { 
    setColumnsData((prevData) => {
      const columnData = prevData.find((item) => item._id === columnId);
      const { taskIds = [] } = columnData;
      const updateTaskIds = taskIds.filter((id) => id !== taskId);

      return prevData.map((item) => {
        if (item._id === columnId) {
          return {
            ...item,
            taskIds: updateTaskIds,
          };
        }
        return item;
      });
    });
    setTasksData((prevData) => prevData.filter((task) => task._id !== taskId));
  };

  const onDeleteList = (columnId) => {
    setColumnsData((prevData) => {
      return prevData.filter((column) => column._id !== columnId);
    });
  
    const newColumns = boardData.columns.filter(id => id !== columnId);
    updateBoardColumns(newColumns);
  };

  return (
    <>
      <div className='workSpacePadding'>
        <div className='workSpaceCard'>
          {currentBoard ? (
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
                      {boardData?.columns.map((columnId, index) => {
                        const column = columnsData.find(col => col._id === columnId);
                        if (!column) return null;

                        const tasks = column.taskIds
                          .map((taskId) =>
                            tasksData.find((task) => task._id === taskId)
                          )
                          .filter(Boolean);

                        return (
                          <Column
                            key={column._id}
                            column={column}
                            tasks={tasks}
                            index={index}
                            onAddTask={onAddTask}
                            onDeleteTask={onDeleteTask}
                            onDeleteList={onDeleteList}
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
                              <TextareaAutosize
                                className='textAreaAutoSizeColumn'
                                placeholder='New Title'
                                value={newListTitle}
                                onChange={handleNewAddListTitle}
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
          ) : (
            <div>Выберите доску</div>
          )}
        </div>
      </div>
    </>
  );
};

export default BoardWorkSpace;
