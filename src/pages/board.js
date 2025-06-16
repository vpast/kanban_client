import { useState, useEffect } from 'react';
import BoardHeader from '../components/BoardHeader';
import BoardList from '../components/BoardList';
import BoardWorkSpace from '../components/BoardWorkSpace';
import { API_URL } from '../config';

const Board = () => {
  const [currentBoard, setCurrentBoard] = useState(null);
  const [boardsData, setBoardsData] = useState([]);

  const fetchBoardsData = async () => {
    try {
      const response = await fetch(`${API_URL}/boards`);
      const data = await response.json();
      setBoardsData(data);
      
      // Если есть доски и нет выбранной, выбираем первую
      if (data.length > 0 && !currentBoard) {
        setCurrentBoard(data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
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
      title: newBoardTitle
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
      console.log('New board created:', result);

      setBoardsData((prevData) => [...prevData, result.board]);
      switchBoard(result.board._id);
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
