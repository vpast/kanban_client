import { useState } from 'react';
import styled from 'styled-components';
import {
  ButtonAdd,
  StyleBoardList,
  StyleBoardListItem,
  StyleBoardListFlex,
  ButtonAccept,
  ButtonDecline,
  Label,
  TaskInput,
  Modal,
} from '../css/StyledComponents';

const ButtonAddBoard = styled(ButtonAdd)`
  width: 185px;
`;

const BoardListModal = styled(Modal)`
  box-shadow: none;
  border-radius: 0;
  background-color: transparent;
  width: 185px;
`

const TaskIinputBoardList = styled(TaskInput)`
  width: auto;
`

const BoardList = ({ boards, currentBoard, switchBoard, addBoard }) => {
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const autoExpandTextarea = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const handleAddBoard = () => {
    if (newBoardTitle.trim() !== '') {
      addBoard(newBoardTitle);
      setShowModal(false);
      setNewBoardTitle(''); // Очистка значения после добавления доски
    }
  }

  const handleBoradNameInputChange = (event) => {
    setNewBoardTitle(event.target.value);
    autoExpandTextarea(event.target);
  };
  
  return (
    <>
      <StyleBoardListFlex className='boardList'>
        <StyleBoardList>
          {boards.map((board) => (
            <StyleBoardListItem
              key={board.id}
              style={{
                background: currentBoard === board.id ? '#ffffff8d' : 'none',
              }}
            >
              <div onClick={() => switchBoard(board.id)}>{board.title}</div>
            </StyleBoardListItem>
          ))}
        </StyleBoardList>
        <ButtonAddBoard onClick={() => setShowModal(true)}>Add Board</ButtonAddBoard>
        {showModal && (
          <BoardListModal>
            <Label>
              <TaskIinputBoardList
                type='text'
                value={newBoardTitle}
                onChange={handleBoradNameInputChange}
                placeholder='Your Board Name'
              />
            </Label>
            <div className='buttonsPlacement'>
              <ButtonAccept onClick={handleAddBoard}>Add</ButtonAccept>
              <ButtonDecline onClick={() => setShowModal(false)}>
                Back
              </ButtonDecline>
            </div>
          </BoardListModal>
        )}
      </StyleBoardListFlex>
    </>
  );
};

export default BoardList;
