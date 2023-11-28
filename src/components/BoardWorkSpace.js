import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import Tasks from '../Tasks';
import { useState } from 'react';

const BoardWorkSpace = () => {
  const [state, setState] = useState(Tasks);

  let onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
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

  return (
    <>
      <div className='workSpacePadding'>
        <div className='workSpaceCard'>
          <DragDropContext onDragEnd={onDragEnd}>
            {state.columnOrder.map((columnId) => {
              const column = state.columns[columnId];
              const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
              return <Column key={column.id} column={column} tasks={tasks} />;
            })}
          </DragDropContext>
        </div>
      </div>
    </>
  );
};

export default BoardWorkSpace;
