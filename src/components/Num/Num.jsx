import "./Num.css"
export default function Number({ num }) {
    return (

        <div className={`
            num
            ${num ===    2 ? "purple" : ""}
            ${num ===    4 ? "indigo" : ""}
            ${num ===    8 ? "blue" : ""}
            ${num ===   16 ? "skyblue" : ""}
            ${num ===   32 ? "yellowgreen" : ""}
            ${num ===   64 ? "yellow" : ""}
            ${num ===  128 ? "orange" : ""}
            ${num ===  256 ? "red" : ""}
            ${num ===  512 ? "pink" : ""}
            ${num === 1024 ? "white" : ""}
            ${num === 2048 ? "rainbow" : ""}
            
        `}>
            {num === 0 ? "" : num}
        </div>

    )
}