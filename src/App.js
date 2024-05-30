import logo from './logo.svg';
import './App.css';
import { useCallback, useEffect, useState } from 'react';

const TABLE_COLS = 5;
const TABLE_ROWS = 5;

const DIRECTIONS = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3
};

// Used to convert the numeric representation to a string output needed for Report.
const DIRECTIONS_ARRAY = ["NORTH", "EAST", "SOUTH", "WEST"];

const NUM_DIRECTIONS = DIRECTIONS_ARRAY.length;

function getMovedState(initialState) {
  const nextState = {
    ...initialState
  };

  switch(initialState.direction) {
    case DIRECTIONS.NORTH:
      nextState.row++;
      break;
    case DIRECTIONS.SOUTH:
      nextState.row--;
      break;
    case DIRECTIONS.WEST:
      nextState.col--;
      break;
    case DIRECTIONS.EAST:
      nextState.col++;
      break;
    default:
      break;
  }

  if (nextState.row >= TABLE_ROWS || nextState.row < 0 || nextState.col >= TABLE_COLS || nextState.col < 0) {
    return initialState;
  }

  return nextState;
}

function Robot({direction}) {
  let rotation = direction * 90;
  return (
    <div className={'robot '} style={{transform: `rotate(${rotation}deg)`}}>
      ^
    </div>
  );
}

// Since we have a southwest origin, not northwest as typical in the web, use mapRowToNative to convert.
function mapRowToNative(row) {
  return (TABLE_ROWS - 1) - row;
}

function Board({robotState, setRobotState}) {
  const placeRobot = useCallback((event) => {
    const cell = event.target.closest(".cell");
    if (!cell) {
      return;
    }

    setRobotState({
      row: mapRowToNative(+cell.getAttribute("data-row")),
      col: +cell.getAttribute("data-col"),
      direction: DIRECTIONS.NORTH
    });
  }, []);

  const rows = [];
  for (let row = 0; row < TABLE_ROWS; row++) {
    const cells = [];
    for (let col = 0; col < TABLE_COLS; col++) {
      cells.push(<td className='cell' key={col} data-row={row} data-col={col}>
        {
          robotState && robotState.col === col && mapRowToNative(robotState.row) === row
            ? <Robot direction={robotState.direction}/>
            : null
        }
      </td>);
    }
      rows.push(<tr className='row' key={row}>{cells}</tr>);
  }

  return (
    <table className='board' onClick={placeRobot}>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

function Controls({robotState, setRobotState}) {
  const [report, setReportState] = useState(null);
  const turnLeft = useCallback(() => {
    setRobotState((currentRobotState) => {
      return {
        ...currentRobotState,
        direction: currentRobotState.direction === DIRECTIONS.NORTH ? DIRECTIONS.WEST : currentRobotState.direction - 1
      };
    })
  });

  const turnRight = useCallback(() => {
    setRobotState((currentRobotState) => {
      return {
        ...currentRobotState,
        direction: (currentRobotState.direction + 1) % NUM_DIRECTIONS
      };
    })
  });

  const move = useCallback(() => {
    setRobotState((currentRobotState) => {
      return getMovedState(currentRobotState);
    })
  });

  // currentReport is the report for this render, this is used to remove the report when it's no longer valid.
  const currentReport = robotState && `${robotState.col}, ${robotState.row}, ${DIRECTIONS_ARRAY[robotState.direction]}`;
  const triggerReport = useCallback(() => {
    setReportState(currentReport);
  });
  
  useEffect(() => {
    let keyboardMovement = (event) => {
      switch(event.key) {
        case "ArrowUp":
          move();
          break;
        case "ArrowRight":
          turnRight();
          break;
        case "ArrowLeft":
          turnLeft();
          break;
        default:
          break;
      }      
    }
    document.addEventListener("keyup", keyboardMovement);

    return () => {
      document.removeEventListener("keyup", keyboardMovement);
    };
  });

  return (
    <>
      <div className='movementControls'>
        <button onClick={turnLeft} disabled={!robotState}>Left</button>
        <button onClick={move} disabled={!robotState}>Move</button>
        <button onClick={turnRight} disabled={!robotState}>Right</button>
      </div>
      <div className='report'>
        <button onClick={triggerReport} disabled={!robotState}>Report</button>
        <p>{report === currentReport ? report : null}</p>
      </div>
      <div className='instructions'>
        Click to place the robot, use the buttons or arrow keys to move.
      </div>
    </>
  );
}

function App() {
  const [robotState, setRobotState] = useState(null);

  return (
    <div className='App'>
      <Board robotState={robotState} setRobotState={setRobotState}/>
      <Controls robotState={robotState} setRobotState={setRobotState}/>
    </div>
  );
}

export default App;
