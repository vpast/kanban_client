import BoardHeader from '../components/BoardHeader';
import BoardList from '../components/BoardList';
import BoardWorkSpace from '../components/BoardWorkSpace';
import { DragDropContext } from 'react-beautiful-dnd';

const Board = () => {
  return (
    <>
      <BoardHeader />
      <BoardList />
      <DragDropContext>
        <BoardWorkSpace />
      </DragDropContext>
    </>
  );
};

export default Board;
