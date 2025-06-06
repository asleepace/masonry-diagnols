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

function Box(props: BoxProps) {

  const onRefCallback = (box: HTMLDivElement) => {
    if (!box || props.scaledDiagonal) return;
    const scale = getScaledDiagonal(box.clientWidth, box.clientHeight);
    props.onDiagnol(scale);
  }

  return (
    <a onClick={props.onClick}>
      <div
        className="masonry-box min-w-12 text-black mb-4 flex justify-center items-center rounded-xs"
        ref={onRefCallback}
        style={{
          width: "100%",
          height: props.height,
          backgroundColor: props.color,
        }}
      >
        <p className="text-black text-2xl font-bold">{Math.round(props.height)}px</p>
      </div>
    </a>
  );
}

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
}: { min?: number; max?: number } = {}) =>
  min + Math.floor(Math.random() * max);

const getRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

// --- app ---

export default function App() {
  const [boxWidth] = React.useState(120);
  const [boxes] = React.useState(generateBoxes(120));
  const [diagnol, setDiagnol] = React.useState(generateBoxes(120));
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

  return (
    <div className="w-full p-4 flex flex-col flex-1">
      <div
        className="masonry-container"
        style={{
          columnWidth: '100%',
          columnCount: 6,
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
              // height={getCachedHeight(id)}
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
