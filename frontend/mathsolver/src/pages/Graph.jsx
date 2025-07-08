import React, { useEffect, useRef } from 'react'

function Graph () {
    const canvasRef = useRef(null)

    useEffect(() => {
        handle()
    }, [])

    const graph = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const width = canvas.width
        const height = canvas.height

        // 중심 좌표 (0, 0) 을 캔버스 중심으로 설정
        const originX = width / 2
        const originY = height / 2
        const scale = 20 // 1 단위당 픽셀 수 (축 확대/축소)

        // 초기화
        ctx.clearRect(0, 0, width, height)

        // 축 그리기
        ctx.strokeStyle = '#ccc'
        ctx.beginPath()
        ctx.moveTo(0, originY)
        ctx.lineTo(width, originY) // x축
        ctx.moveTo(originX, 0)
        ctx.lineTo(originX, height) // y축
        ctx.stroke()

        // 함수: y = x^2
        ctx.beginPath()
        ctx.strokeStyle = 'black'

        for (let x = -10; x <= 10; x += 0.1) {
            const y = x * x
            const canvasX = originX + x * scale
            const canvasY = originY - y * scale

            if (x === -10) {
                ctx.moveTo(canvasX, canvasY)
            } else {
                ctx.lineTo(canvasX, canvasY)
            }
        }

        ctx.stroke()
    }
    const handle = () => {
        const canvas = canvasRef.current
        if (canvas) {
            let ctx = canvas.getContext("2d");
            const width = canvas.width
            const height = canvas.height

            roundedRect(ctx, 12, 12, width - 24, height - 24, 15);
            roundedRect(ctx, 19, 19, width - 38, height - 38, 9);
            roundedRect(ctx, 53, 53, 49, 33, 10);
            roundedRect(ctx, 53, 119, 49, 16, 6);
            roundedRect(ctx, 135, 53, 49, 33, 10);
            roundedRect(ctx, 135, 119, 25, 49, 10);

            ctx.beginPath();
            ctx.arc(37, 37, 13, Math.PI / 7, -Math.PI / 7, false);
            ctx.lineTo(31, 37);
            ctx.fill();

            for (var i = 0; i < 8; i++) {
                ctx.fillRect(51 + i * 16, 35, 4, 4);
            }

            for (i = 0; i < 6; i++) {
                ctx.fillRect(115, 51 + i * 16, 4, 4);
            }

            for (i = 0; i < 8; i++) {
                ctx.fillRect(51 + i * 16, 99, 4, 4);
            }

            ctx.beginPath();
            ctx.moveTo(83, 116);
            ctx.lineTo(83, 102);
            ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
            ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
            ctx.lineTo(111, 116);
            ctx.lineTo(106.333, 111.333);
            ctx.lineTo(101.666, 116);
            ctx.lineTo(97, 111.333);
            ctx.lineTo(92.333, 116);
            ctx.lineTo(87.666, 111.333);
            ctx.lineTo(83, 116);
            ctx.fill();

            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.moveTo(91, 96);
            ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
            ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
            ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
            ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
            ctx.moveTo(103, 96);
            ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
            ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
            ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
            ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
            ctx.fill();
        }
    }

    // A utility function to draw a rectangle with rounded corners.
    function roundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.lineTo(x + width - radius, y + height);
        ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
        ctx.lineTo(x + width, y + radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.lineTo(x + radius, y);
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.stroke();
    }


    return (
        <div>
            <h1>그래프</h1>
            {/* <canvas
                ref={canvasRef}
                width={600}
                height={400}
                style={{ border: '1px solid black' }}
            /> */}
        </div>
    )
}

export default Graph
