import { useEffect, useState } from "react";
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
  const [numberOfColumns, setNumberOfColumns] = useState(getNumberOfColumns(window.innerWidth));
  useEffect(() => {
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
        if (!box || !props.onDiagnol || props.scaledDiagonal) return;
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

const generateBoxes = (count: number): BoxProps[] => {
  return new Array(count).fill(0).map((_, i) => ({
    index: i,
    width: 120,
    height: getRandomHeight(),
    color: getRandomColor(),
    onDiagnol: () => {},
    onClick: () => {},
  }));
};

// --- app ---

const BOXES = generateBoxes(120);


export default function App() {
  const [boxWidth] = useState(120);
  const [boxes] = useState([...BOXES]);
  const [diagnol, setDiagnol] = useState(BOXES.map(() => 0));
  const [count, setCount] = useState(0);

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
        {boxes.map((box, id) => {
          return (
            <Box
              onClick={() => setCount(count + 1)}

              height={box.height}
              width={boxWidth}
              color={box.color}
              key={`box-${box.index}`}
              index={box.index}
            />
          );
        })}
      </div>
    </div>
  );
}
