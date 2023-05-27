import { Droppable } from 'react-beautiful-dnd';
import TaskList from './TaskList';

const BoardWorkSpace = () => {
  let getId = (event, id) => {
    event.preventDefault();
    id = event.target.id;
    return id;
  };

  return (
    <>
      <div className='workSpacePadding'>
        <div className='workSpaceCard'>
          <Droppable droppableId='1'>
            {(provided) => (
              <div ref={provided.innerRef}>
                <TaskList {...provided.droppableProps}>
                  {provided.placeholder}
                </TaskList>
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </>
  );
};

export default BoardWorkSpace;
