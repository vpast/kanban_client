import isPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

//BoardList.js

export const StyleBoardListFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyleBoardList = styled.ul`
  list-style: none;
  margin: 0;
  margin-top: 15px;
  padding: 0;
  text-align: center;
  font-weight: 600;
`;

export const StyleBoardListItem = styled.li`
  width: 185px;
  height: 42px;
  border-radius: 10px;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  > div {
    padding-bottom: 3px;
  }
`;

// Boardworkspace.js

export const AddListButton = styled.button.withConfig({
  shouldForwardProp: (prop) => isPropValid(prop),
})`
  background-color: #ffffff3d;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  margin: 5px;
  display: flex;
  align-items: center;
  width: 208px;
  height: 42px;

  display: ${(props) => (props.isVisible ? 'block' : 'none')};

  &:hover {
    background-color: #ffffff8d;
    color: black;
  }

  &::before {
    content: '+ ';
    font-size: 20px;
  }
`;

// Column.js

export const Container = styled.div`
  height: ${(props) => props.dynamicHeight}px;
  width: 220px;
  box-shadow: 0px 1px 1px #091e4240, 0px 0px 1px #091e424f;
  border-radius: 10px;
  margin: 5px;
  background-color: #f1f2f4;
  display: flex;
  flex-direction: column;
`;

export const TitleFlex = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  cursor: pointer;
`;

export const Title = styled.div`
  font-weight: 600;
  padding: 8px;
  margin-left: 2px;
`;

export const RenameFlex = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2px;
`;

export const RenameButton = styled.button`
  border: none;
  border-radius: 5px;
  color: black;
  padding: 8px;
  margin: 3px;
  text-align: center;
  text-decoration: none;
  display: none;
  font-size: 12px;
  cursor: pointer;

  ${TitleFlex}:hover & {
    display: block;
  }
`;

export const TaskList = styled.div.withConfig({
  shouldForwardProp: (prop) => isPropValid(prop),
})`
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? 'lightsalmon' : '#f1f2f4'};
  flex-grow: 1;
  border-radius: 10px;
`;

export const ButtonAdd = styled.button.withConfig({
  shouldForwardProp: (prop) => isPropValid(prop),
})`
  background-color: rgb(12, 102, 228);
  border: none;
  border-radius: 10px;
  color: white;
  padding: 12px;
  margin: 5px;
  margin-bottom: 7px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 208px;
  cursor: pointer;

  &:hover {
    background-color: lightsalmon;
    color: black;
  }
`;

export const ButtonAccept = styled.button`
  background-color: rgb(12, 102, 228);
  border: none;
  border-radius: 5px;
  color: white;
  padding: 8px;
  margin: 5px;
  margin-bottom: 7px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 100px;
  cursor: pointer;

  &:hover {
    background-color: rgb(0, 206, 0);
    color: black;
  }
`;

export const ButtonDecline = styled.button`
  background-color: rgb(12, 102, 228);
  border: none;
  border-radius: 5px;
  color: white;
  padding: 8px;
  margin: 5px;
  margin-bottom: 7px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 100px;
  cursor: pointer;

  &:hover {
    background-color: #fc4949;
    color: black;
  }
`;

export const ButtonDeleteList = styled.button`
  background-color: rgb(12, 102, 228);
  border: none;
  border-radius: 5px;
  color: white;
  padding: 8px;
  margin: 5px;
  margin-bottom: 7px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 208px;
  cursor: pointer;

  &:hover {
    background-color: #fc4949;
    color: black;
  }
`;

export const Modal = styled.div`
  box-shadow: 0px 1px 1px #091e4240, 0px 0px 1px #091e424f;
  border-radius: 10px;
  margin: 4px;
  background-color: #f1f2f4;
`;

export const Label = styled.label`
  font-weight: 600;
  display: flex;
  flex-direction: column;
`;

export const LabelTitle = styled.p`
  color: black;
  padding: 8px;
`;

// Tasks.js

export const TaskContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

export const TaskContent = styled.div`
  flex-grow: 1;
  word-wrap: break-word;
  white-space: pre-line;
  overflow-wrap: break-word;
  min-height: 20px;
  overflow: hidden;
  margin-right: 30px;
`;

export const DeleteButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: black;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);

  ${TaskContainer}:hover & {
    display: block;
  }
`;
