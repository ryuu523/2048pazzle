import { useEffect } from "react";
import './App.css';
import useField from "./hooks/useField";
import Cell from "./components/Cell/Cell";

export default function App() {
  const { field, endFlag, initFlag, crearFlag, moveUp, moveDown, moveLeft, moveRight } = useField([])



  const handleKeyDown = (e) => {
    if (initFlag.current) {
      switch (e.key) {

        case "ArrowUp":
          moveUp()
          break

        case "ArrowDown":
          moveDown()
          break

        case "ArrowLeft":
          moveLeft()
          break

        case "ArrowRight":
          moveRight()
          break
        default:
          break
      }
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])
  return (
    <div className="center">
      <div className="field">
        {field.map((cells, y) => {
          return cells.map((number, x) => {
            return <Cell num={number} key={y + ":" + x}></Cell>
          })
        })
        }
      </div>
      {endFlag ? <div className="end">GAMEOVER</div> : <></>}
      {crearFlag ? <div className="crear">CREAR</div> : <></>}
    </div>
  );
}