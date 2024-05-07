import { useState } from 'react';
import BoardHeader from '../components/BoardHeader';
import BoardList from '../components/BoardList';
import BoardWorkSpace from '../components/BoardWorkSpace';

const Board = () => {
  const [currentBoard, setCurrentBoard] = useState(0);
  const [boards, setBoards] = useState([{ id: 0, title: 'Main Board' }]);

  const switchBoard = (boardId) => {
    setCurrentBoard(boardId);
  };

  const addBoard = (title) => {
    const newBoard = { id: boards.length, title: title };
    setBoards([...boards, newBoard]);
    switchBoard(newBoard.id);
  };

  return (
    <>
      <BoardHeader />
      <BoardList
        boards={boards}
        currentBoard={currentBoard}
        switchBoard={switchBoard}
        addBoard={addBoard}
      />
      <BoardWorkSpace
        boards={boards}
        currentBoard={currentBoard}
        switchBoard={switchBoard}
      />
    </>
  );
};

export default Board;
