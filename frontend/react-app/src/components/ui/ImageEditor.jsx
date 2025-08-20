import React, { useRef, useState } from "react"

export const ImageEditor = () => {
    const canvasRef = useRef(null)
    const [image, setImage] = useState(null)

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            const img = new Image()
            img.onload = () => {
                setImage(img)
                const canvas = canvasRef.current
                const ctx = canvas.getContext("2d")
                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0)
            }
            img.src = reader.result
        }
        reader.readAsDataURL(file)
    }

    const handleCrop = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        // 자를 영역 (x, y, width, height) 예시
        const cropX = 50
        const cropY = 50
        const cropWidth = 200
        const cropHeight = 200

        const croppedImage = ctx.getImageData(cropX, cropY, cropWidth, cropHeight)
        canvas.width = cropWidth
        canvas.height = cropHeight
        ctx.putImageData(croppedImage, 0, 0)
    }

    return (
        <div>
            <input type="file" onChange={handleImageUpload} />
            <br />
            <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
            <br />
            <button onClick={handleCrop}>자르기</button>
        </div>
    )
}