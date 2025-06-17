import React, { useState } from 'react'

function TextExtractor() {
    const [file, setFile] = useState(null)
    const [extractedText, setExtractedText] = useState('')
    const [loading, setLoading] = useState(false)

    const handleFileChange = (e) => {
        console.log('handleFileChange', e.target.files);
        setFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!file) return

        setLoading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/extract-text', {
                method: 'POST',
                body: formData
            })

            if (!response) throw new Error('Server Error')
            
            const data = await response.json()
            setExtractedText(data.text)
        } catch(err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>문자 인지</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} /><br /><br />
                <button disabled={loading} type="submit">
                {loading ? "추출 중…" : "추출"}
                </button>
            </form>

            {extractedText && (
                <div>
                <h2>추출 결과</h2>
                <pre>{extractedText}</pre>
                </div>
            )}

            {loading && <p>추출 중입니다...</p>}
        </div>
    )
}

export default TextExtractor