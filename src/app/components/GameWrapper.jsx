'use client'
import {Game} from "@/app/game/game";
import {useEffect, useRef} from "react";


export default function GameWrapper() {
    const container = useRef(null)

    useEffect(() => {
        if (!container.current) return;
        const game = new Game();
        (async () => {
            await game.init(container.current);
        })();
        return () => {
            game.destroy();
        };
    }, []);
    return (
        <div className={"game-wrapper"}>
            <canvas ref={container} style={{
                width: "100%",
                height: "100%",
                display: "block"
            }}/>
        </div>
    )
}

