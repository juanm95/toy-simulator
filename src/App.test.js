import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event'

test('passes example 1', async () => {
  /**
    PLACE 0,0,NORTH
    MOVE
    REPORT
    Output: 0,1,NORTH
   */
  const {container} = render(<App />);
  const startingSquare = container.querySelector('[data-row="4"][data-col="0"]'); // note, 4 is used here because we are querying by web standards.
  await userEvent.click(startingSquare);

  const moveButton = screen.getByText("Move");
  const reportButton = screen.getByText("Report");
  await userEvent.click(moveButton);
  await userEvent.click(reportButton);
  expect(await screen.findByText("0, 1, NORTH")).toBeInTheDocument;
});

test('passes example 2', async () => {
  /**
    PLACE 0,0,NORTH
    LEFT
    REPORT
    Output: 0,0,WEST
   */
  const {container} = render(<App />);
  const startingSquare = container.querySelector('[data-row="4"][data-col="0"]');
  await userEvent.click(startingSquare);

  const leftButton = screen.getByText("Left");
  const reportButton = screen.getByText("Report");
  await userEvent.click(leftButton);
  await userEvent.click(reportButton);
  expect(await screen.findByText("0, 0, WEST")).toBeInTheDocument;
});

test('passes example 3', async () => {
  /**
    PLACE 1,2,North
    MOVE
    MOVE
    RIGHT
    MOVE
    REPORT
    Output: 2,4,East
   */
  const {container} = render(<App />);
  const startingSquare = container.querySelector('[data-row="2"][data-col="1"]');
  await userEvent.click(startingSquare);

  const moveButton = screen.getByText("Move");
  const rightButton = screen.getByText("Right");
  const reportButton = screen.getByText("Report");

  await userEvent.click(moveButton);
  await userEvent.click(moveButton);
  await userEvent.click(rightButton);
  await userEvent.click(moveButton);
  await userEvent.click(reportButton);
  expect(await screen.findByText("2, 4, EAST")).toBeInTheDocument;
});

test('gracefully stays in place when running into a wall', async () => {
  /**
    PLACE 0,4,NORTH
    MOVE
    MOVE
    MOVE
    REPORT
    Output: 0,4,NORTH
   */
  const {container} = render(<App />);
  const startingSquare = container.querySelector('[data-row="0"][data-col="0"]');
  await userEvent.click(startingSquare);

  const moveButton = screen.getByText("Move");
  const reportButton = screen.getByText("Report");

  await userEvent.click(moveButton);
  await userEvent.click(moveButton);
  await userEvent.click(moveButton);
  await userEvent.click(reportButton);
  expect(await screen.findByText("0, 4, NORTH")).toBeInTheDocument;
});