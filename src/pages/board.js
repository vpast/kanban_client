import { useState, useEffect } from 'react';
import BoardHeader from '../components/BoardHeader';
import BoardList from '../components/BoardList';
import BoardWorkSpace from '../components/BoardWorkSpace';
import { API_URL } from '../config';

const Board = () => {
  const [currentBoard, setCurrentBoard] = useState(0);
  const [boardsData, setBoardsData] = useState([]);

  const fetchBoardsData = async () => {
    const response = await fetch(`${API_URL}/boards`);
    const data = await response.json();
    setBoardsData(data);
  };

  useEffect(() => {
    fetchBoardsData();
  }, []);

  const switchBoard = (boardId) => {
    setCurrentBoard(boardId);
  };

  const addBoardHandler = async (newBoardTitle) => {
    const newBoardObject = {
      columns: [],
      title: newBoardTitle,
      columnOrder: []
    };

    try {
      const response = await fetch(`${API_URL}/boards/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board: newBoardObject,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add board');
      }

      const result = await response.json();
      console.log(result);

      setBoardsData((prevData) => [...prevData, newBoardObject]);
      switchBoard(result._id);
    } catch (error) {
      console.error('Error adding board:', error);
    }    
  };

  return (
    <>
      <div className='root backgroundImage'>
        <BoardHeader />
        <BoardList
          boardsData={boardsData}
          currentBoard={currentBoard}
          switchBoard={switchBoard}
          addBoardHandler={addBoardHandler}
        />
        <BoardWorkSpace
          boardsData={boardsData}
          currentBoard={currentBoard}
          switchBoard={switchBoard}
        />
      </div>
    </>
  );
};

export default Board;
