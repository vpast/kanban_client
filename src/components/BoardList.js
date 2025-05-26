import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';
import {
  ButtonAdd,
  StyleBoardList,
  StyleBoardListItem,
  StyleBoardListFlex,
  ButtonAccept,
  ButtonDecline,
  Label,
  Modal,
} from '../css/StyledComponents';

const ButtonAddBoard = styled(ButtonAdd)`
  width: 185px;

  display: ${(props) => (props.isBoardListEditing ? 'none' : 'block')};
`;

const BoardListModal = styled(Modal)`
  box-shadow: none;
  border-radius: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BoardList = ({ boardsData, currentBoard, switchBoard, addBoardHandler }) => {
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isBoardListEditing, setIsBoardListEditing] = useState(false);

  const handleAddBoard = () => {
    if (newBoardTitle.trim() !== '') {
      addBoardHandler(newBoardTitle);
      setShowModal(false);
      setNewBoardTitle('');
      setIsBoardListEditing(false);
    }
  };

  const handleBoradNameInputChange = (event) => {
    setNewBoardTitle(event.target.value);
  };

  return (
    <>
      <StyleBoardListFlex className='boardList'>
        <StyleBoardList>
          {boardsData.map((board) => (
            <StyleBoardListItem
              key={board._id}
              style={{
                background: currentBoard === board._id ? '#ffffff8d' : 'none',
              }}
            >
              <div onClick={() => switchBoard(board._id)}>{board.title}</div>
            </StyleBoardListItem>
          ))}
        </StyleBoardList>
        <ButtonAddBoard
          isBoardListEditing={isBoardListEditing}
          onClick={() => {
            setShowModal(true);
            setIsBoardListEditing(true);
          }}
        >
          Add Board
        </ButtonAddBoard>
        {showModal && (
          <BoardListModal>
            <Label>
              <TextareaAutosize
                className='textAreaAutoSizeList'
                placeholder='Your Board Name'
                value={newBoardTitle}
                onChange={handleBoradNameInputChange}
              />
            </Label>
            <div className='buttonsPlacement'>
              <ButtonAccept onClick={handleAddBoard}>Add</ButtonAccept>
              <ButtonDecline
                onClick={() => {
                  setShowModal(false);
                  setIsBoardListEditing(false);
                }}
              >
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
