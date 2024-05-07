import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './Column';
import Tasks from '../Tasks';
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
  const [state, setState] = useState(Tasks);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddButtonVisible, setAddButtonVisible] = useState(true);
  const [columnsData, setColumnsData] = useState([]);
  const [tasksData, setTasksData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/columns')
      .then((res) => res.json())
      .then((data) => {
        setColumnsData(data);
      });
  }, [setColumnsData]);

  // columnsData.map((column) => console.log(column.id));

  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then((res) => res.json())
      .then((data) => {
        setTasksData(data);
      });
  }, [setTasksData]);

  // console.log(state);

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

  const updateState = (newState) => {
    // console.log('Updating state in BoardWorkSpace:', newState);
    setState(newState);
  };

  const handleNewAddListTitle = (event) => {
    setNewListTitle(event.target.value);
  };

  const handleAddList = () => {
    const newColumn = {
      id: `column-${Date.now()}`,
      title: newListTitle,
      taskId: [],
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn,
      },
      columnOrder: [...state.columnOrder, newColumn.id],
    };
    updateState(newState);

    setShowAddListModal(false);
    setNewListTitle('');
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
                      // console.log(column);

                      // if (column.taskIds === undefined) {
                      //   column.taskIds = [];
                      // }
                      // const tasks = column.taskIds.map(
                      //   (taskId) => state.tasks[taskId]
                      //   );
                      // console.log(column, column.taskIds, tasksData.id)

                      const tasks = tasksData
                        .filter((task) => column.taskIds.includes(task.id))
                        .map((filteredTask) => state.tasks[filteredTask.id]);

                      // console.log(tasks)
                      return (
                        <Column
                          key={column.id}
                          column={column}
                          tasks={tasks}
                          index={index}
                          updateData={updateState}
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
