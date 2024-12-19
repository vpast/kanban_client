import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './Column';
// import Tasks from '../Tasks';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
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

const BoardWorkSpace = () => {
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddButtonVisible, setAddButtonVisible] = useState(true);
  const [columnsData, setColumnsData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);

  const fetchColumnsData = () => {
    fetch('http://localhost:5000/columns')
      .then((res) => res.json())
      .then((data) => {
        setColumnsData(data);
      });
  };

  const fetchColumnOrderData = () => {
    fetch('http://localhost:5000/columns/order/columnOrder')
      .then((res) => res.json())
      .then((data) => {
        setColumnOrder(data[0].columnOrder);
        console.log(columnOrder);
      });
  };

  // columnsData.map((column) => console.log(column.id));

  const fetchTasksData = () => {
    fetch('http://localhost:5000/tasks')
      .then((res) => res.json())
      .then((data) => {
        // const tasks = {};
        // data.forEach((task) => {
        //   tasks[task.id] = task;
        // });
        // setState((prevState) => ({
        //   ...prevState,
        //   tasks: tasks,
        // }));
        setTasksData(data);
        // console.log(tasksData)
      });
  };

  useEffect(() => {
    fetchColumnsData();
    fetchColumnOrderData();
    fetchTasksData();
  }, []);

  // console.log(tasksData);
  // console.log(columnsData);

  let onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;
    // console.log(columnsData, columnsData[source.droppableId])

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
      const newColumnOrder = Array.from(columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setColumnOrder(newColumnOrder);
      updateColumnOrder(newColumnOrder);
      console.log(newColumnOrder);
      return;
    }

    const columnStart = columnsData.find(
      (column) => column.id === source.droppableId
    );
    console.log(columnStart);

    const columnFinish = columnsData.find(
      (column) => column.id === destination.droppableId
    );
    console.log(columnFinish);

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
          col.id === updatedColumn.id ? updatedColumn : col
        )
      );

      try {
        await fetch(`http://localhost:5000/columns/${updatedColumn.id}`, {
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

    console.log("newStart:", newStart);

    const finishTaskIds = Array.from(columnFinish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...columnFinish,
      taskIds: finishTaskIds,
    };

    setColumnsData((prevData) =>
      prevData.map((col) =>
        col.id === newStart.id
          ? newStart
          : col.id === newFinish.id
          ? newFinish
          : col
      )
    );

    try {
      await fetch(`http://localhost:5000/columns/${newStart.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ column: newStart }),
      });

      await fetch(`http://localhost:5000/columns/${newFinish.id}`, {
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

  const updateColumnOrder = async (newOrder) => {
    console.log(newOrder);

    try {
      await fetch('http://localhost:5000/columns/order/updateColumnOrder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewAddListTitle = (event) => {
    setNewListTitle(event.target.value);
  };

  const handleAddList = async () => {
    const columnId = 'column-' + Date.now();
    const newColumnObject = {
      id: columnId,
      title: newListTitle,
      taskIds: [],
    };

    try {
      const response = await fetch('http://localhost:5000/columns/column', {
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

      setColumnsData((prevData) => [...prevData, newColumnObject]);
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
        if (item.id === columnId) {
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

  const onDeleteTask = (taskId, columnId) => {
    setColumnsData((prevData) => {
      const columnData = prevData.find((item) => item.id === columnId);
      const { taskIds = [] } = columnData;
      const updateTaskIds = taskIds.filter((id) => id !== taskId);

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
    setTasksData((prevData) => prevData.filter((task) => task.id !== taskId));
  };

  const onDeleteList = (columnId) => {
    setColumnsData((prevData) => {
      return prevData.filter((column) => column.id !== columnId);
    });
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
                    {columnOrder.map((columnId, index) => {
                      const column = columnsData.find(
                        (column) => column.id === columnId
                      );
                      if (!column || !column.taskIds) {
                        console.log(column);
                        return [];
                      }
                      // console.log(column);

                      const tasks = tasksData.filter((task) => {
                        return column.taskIds.includes(task.id);
                      });

                      return (
                        <Column
                          key={column.id}
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
            <ButtonAccept onClick={fetchColumnOrderData}>
              Test Get from DB
            </ButtonAccept>
          </DragDropContext>
        </div>
      </div>
    </>
  );
};

export default BoardWorkSpace;
