import React from "react";
import "./index.css";

type BoxProps = {
  index: number;
  width: number;
  height: number;
  color: string;
  scaledDiagonal?: number;
  onDiagnol: (scale: number) => void;
  onClick: () => void;
};

// --- hooks --- 

function useNumberOfColumns() {
  const [numberOfColumns, setNumberOfColumns] = React.useState(getNumberOfColumns(window.innerWidth));
  React.useEffect(() => {
    const handleResize = () => setNumberOfColumns(getNumberOfColumns(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return numberOfColumns;
}

// --- box element ---

const Box = (props: BoxProps) => (
  <a onClick={props.onClick}>
    <div
      className="masonry-box min-w-24 max-w-64 w-full text-black mb-4 flex justify-center items-center rounded-xs"
      style={{
        height: props.height,
        backgroundColor: props.color,
      }}
      ref={(box: HTMLDivElement) => {
        if (!box || props.scaledDiagonal) return;
        props.onDiagnol(getScaledDiagonal(box.clientWidth, box.clientHeight));
      }}
    >
      <p className="text-black text-center text-2xl font-bold">
        <span className="text-black/75 text-sm mb-2">#{props.index}</span>
        <br />
        {Math.round(props.height)}px
      </p>
    </div>
  </a>
)

// --- utils ---

const generateBoxes = (count: number) => {
  return new Array(count).fill(0).map((_, i) => i);
};

const getDiagonal = (width: number, height: number) => {
  return Math.sqrt(width * width + height * height);
};

const getWindowDiagonal = () => {
  return getDiagonal(window.innerWidth, window.innerHeight);
};

const getScaledDiagonal = (width: number, height: number) => {
  const windowDiagonal = getWindowDiagonal();
  const boxDiagonal = getDiagonal(width, height);
  return boxDiagonal / windowDiagonal;
};

const getRandomHeight = ({
  min = 80,
  max = 160,
}: { min?: number; max?: number } = {}) => {
  return min + Math.floor(Math.random() * max);
}

const getRandomColor = () => {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
}

const MAX_COLUMN_WIDTH = 256;

const getNumberOfColumns = (width: number) => {
  return Math.ceil(window.innerWidth / MAX_COLUMN_WIDTH)
}

// --- app ---

const BOXES = generateBoxes(120);


export default function App() {
  const [boxWidth] = React.useState(120);
  const [boxes] = React.useState([...BOXES]);
  const [diagnol, setDiagnol] = React.useState([...BOXES]);
  const [count, setCount] = React.useState(0);

  const getCachedHeight = (id: number) => {
    const scale = diagnol.at(id);
    if (!scale) return getRandomHeight();
    const windowDiagonal = getWindowDiagonal();
    const height = scale * windowDiagonal;
    return height;
  };

  const setDiagnolForId = (id: number, scale: number) => {
    const newDiagnol = [...diagnol];
    newDiagnol[id] = scale;
    setDiagnol(newDiagnol);
  };

  const numberOfColumns = useNumberOfColumns();

  return (
    <div className="w-full p-4 flex flex-col flex-1">
      <div
        style={{
          columnWidth: "100%",
          columnCount: numberOfColumns,
          columnGap: "1rem",
          width: "100%",
        }}
      >
        {boxes.map((id) => {
          return (
            <Box
              onClick={() => setCount(count + 1)}
              onDiagnol={(diagonal) => setDiagnolForId(id, diagonal)}
              scaledDiagonal={diagnol.at(id)}
              height={getRandomHeight()}
              width={boxWidth}
              color={getRandomColor()}
              key={`box-${id}`}
              index={id}
            />
          );
        })}
      </div>
    </div>
  );
}
