import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './Column';
import Tasks from '../Tasks';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;

const BoardWorkSpace = () => {
  const [state, setState] = useState(Tasks);

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
      const newColumnOrder = Array.from(state.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = {
        ...state,
        columnOrder: newColumnOrder
      }
      setState(newState)
      return
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
                <Container {...provided.droppableProps} ref={provided.innerRef}>
                  {state.columnOrder.map((columnId, index) => {
                    const column = state.columns[columnId];
                    const tasks = column.taskIds.map(
                      (taskId) => state.tasks[taskId]
                    );
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
                </Container>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </>
  );
};

export default BoardWorkSpace;
