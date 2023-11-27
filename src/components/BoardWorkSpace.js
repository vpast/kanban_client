import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import Tasks from '../Tasks';

const BoardWorkSpace = () => {
  let state = Tasks;

  let onDragEnd = (result) => {};

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
