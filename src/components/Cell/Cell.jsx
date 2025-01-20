import Num from "../Num/Num"
import "./Cell.css"

export default function Cell({ num }) {
    return (
        <div className="cell">
            <Num num={num}></Num>
        </div>
    )
}