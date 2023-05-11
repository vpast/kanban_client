import { Draggable, Droppable } from 'react-beautiful-dnd';

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
          <Droppable droppableId={getId}>
            {(provided) => (
              <ul innerRef={provided.innerRef} {...provided.droppableProps}>
                <Draggable draggableId={getId}>
                  {(provided) => {
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      innerRef={provided.innerRef}
                    >
                      <li id='1'>Task 1</li>
                    </div>;
                  }}
                </Draggable>
                <li id='2'>Task 2</li>
                <li id='3'>Task 3</li>
                <li id='4'>Task 4</li>
                <li id='5'>Task 5</li>
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
      </div>
    </>
  );
};

export default BoardWorkSpace;
