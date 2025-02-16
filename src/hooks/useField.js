import { useEffect, useRef, useState } from "react";

export default function useField() {

    const [field, setField] = useState([])
    const [endFlag, setEndFlag] = useState(false)
    const [crearFlag, setCrearFlag] = useState(false)
    const FIELD_WIDTH = 4
    const FIELD_HEIGHT = 4
    const initFlagRef = useRef(false)

    //初期化
    const init = () => {
        setField(() => {
            const cells = [...Array(FIELD_HEIGHT)].map(() => {
                return [...Array(FIELD_WIDTH).fill(0)]
            })
            const coords = [...Array(16)].map((_, i) => ({ x: i % 4, y: Math.floor(i / 4) }))
            //初期の2を配置
            for (let i = 0; i < 2; i++) {
                const rand = Math.floor(Math.random() * coords.length)
                const pos = coords[rand]
                cells[pos.y][pos.x] = 2
                coords.splice(rand, 1)
            }
            return cells
        })
        initFlagRef.current = true

    }

    //2をfieldに生成する関数
    const makeNum = (field) => {
        //フィールドがうまっていたらreturn
        if (field.flat().filter(num => num === 0).length === 0) {
            return
        }
        //fieldの全ての座表の配列生成
        let coords = [...Array(16)].map((_, i) => ({ x: i % 4, y: Math.floor(i / 4) }))
        //そこからfieldのなにもない座標だけの配列を生成
        coords = coords.filter((pos) => field[pos.y][pos.x] === 0)
        const rand = Math.floor(Math.random() * coords.length)
        //おけるところからランダムに選択
        const pos = coords[rand]
        //セット
        field[pos.y][pos.x] = 2
        return field

    }

    const move = (deg, field) => {
        if (field.flat().filter(ele => ele === 2048).length === 1) {
            return field
        }
        //それぞれの移動方向
        const dx = Math.round(Math.cos(deg * (Math.PI / 180)))
        const dy = Math.round(Math.sin(deg * (Math.PI / 180))) * (-1)
        //もし動けなかったら（結合できないも含む）

        if (!isMovable(field.map(row => row.concat()), deg)) {
            return field
        }

        //詰めれるとこまで詰める
        const movedField = shorten(dx, dy, field.map(row => row.concat()))


        //くっつける
        const mergeField = merge(dx, dy, movedField.map(row => row.concat()))

        if (mergeField.flat().filter(e => e === 2048) >= 1) {
            setCrearFlag(true)
        }
        //２を作る
        const newField = makeNum(mergeField.map(row => row.concat()))

        return newField
    }

    const merge = (dx, dy, field) => {
        let coords = [...Array(16)].map((_, i) => ({ x: i % 4, y: Math.floor(i / 4) }))
        //そこからfieldのなんかあるとこだけの配列生成
        coords = coords.filter((pos) => field[pos.y][pos.x] !== 0)
        if (dx === 1 || dy === 1) {
            coords.reverse()
        }
        for (const coord of coords) {
            const nx = coord.x + dx
            const ny = coord.y + dy
            if (withInField(ny, nx)) {

                if (field[coord.y][coord.x] === field[ny][nx]) {
                    field[ny][nx] += field[coord.y][coord.x]
                    field[coord.y][coord.x] = 0
                }
            }
        }
        //詰めれるとこまで詰める
        const movedField = shorten(dx, dy, field.map(row => row.concat()))
        return movedField
    }
    const isMovable = (field, deg) => {


        let flag = false

        const dx = Math.round(Math.cos(deg * (Math.PI / 180)))
        const dy = Math.round(Math.sin(deg * (Math.PI / 180))) * (-1)
        let coords = [...Array(16)].map((_, i) => ({ x: i % 4, y: Math.floor(i / 4) }))
        //そこからfieldのなんかあるとこだけの配列生成
        coords = coords.filter((pos) => field[pos.y][pos.x] !== 0)
        //処理順逆にして衝突（？）回避
        if (dx === 1 || dy === 1) {
            coords.reverse()
        }
        //詰めれるとこまで詰める
        for (const coord of coords) {
            let increse = 1
            while (!flag) {
                const nx = coord.x + dx * increse
                const ny = coord.y + dy * increse
                if (withInField(ny, nx) && field[ny][nx] === 0) {
                    flag = true
                } else {
                    break
                }
            }
        }
        for (const coord of coords) {
            const nx = coord.x + dx
            const ny = coord.y + dy
            if (withInField(ny, nx)) {

                if (field[coord.y][coord.x] === field[ny][nx]) {
                    flag = true
                }
            }

        }

        return flag
    }
    const shorten = (dx, dy, field) => {
        //fieldの全ての座表の配列生成
        let coords = [...Array(16)].map((_, i) => ({ x: i % 4, y: Math.floor(i / 4) }))
        //そこからfieldのなんかあるとこだけの配列生成
        coords = coords.filter((pos) => field[pos.y][pos.x] !== 0)
        //処理順逆にして衝突（？）回避
        if (dx === 1 || dy === 1) {
            coords.reverse()
        }
        //詰めれるとこまで詰める
        for (const coord of coords) {
            let increse = 1
            while (true) {
                const nx = coord.x + dx * increse
                const ny = coord.y + dy * increse
                if (withInField(ny, nx) && field[ny][nx] === 0) {
                    field[ny][nx] = field[ny - dy][nx - dx]
                    field[ny - dy][nx - dx] = 0
                    increse += 1
                } else {
                    break
                }
            }
        }
        return field
    }
    const withInField = (y, x) => {
        if (x < 4 && x >= 0 && y < 4 && y >= 0) {
            return true
        }
        return false
    }
    const moveUp = () => {
        setField((prevField) => {
            const newField = move(90, prevField.map(row => row.concat()))

            return newField
        })
    }
    const moveDown = () => {
        setField((prevField) => {
            const newField = move(270, prevField.map(row => row.concat()))
            return newField
        })
    }
    const moveLeft = () => {
        setField((prevField) => {
            const newField = move(180, prevField.map(row => row.concat()))
            return newField
        })
    }
    const moveRight = () => {
        setField((prevField) => {
            const newField = move(0, prevField.map(row => row.concat()))
            return newField
        })
    }
    //初回だけ
    useEffect(() => {
        init()
    }, [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (initFlagRef.current && !field.length === 0) {
            const movableArray = [...Array(4)].fill(false)
            for (let deg = 90; deg <= 270; deg += 90) {
                movableArray[(deg / 90) - 1] = isMovable(field.map(row => row.concat()), deg)
            }
            //もし埋まっていたら
            if (movableArray.filter(flag => flag === false).length === 4 && field.flat().filter(con => con === 0).length === 0) {
                setEndFlag(true)
            }

        }

    }, [field])

    return { field, endFlag, crearFlag, initFlag: initFlagRef, moveUp, moveDown, moveLeft, moveRight }
}