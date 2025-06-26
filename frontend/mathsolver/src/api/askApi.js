export const askQuestionApi = (question, signal) => {
    return fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question }),
        signal: signal
    })
}

export const askWithImageApi = (imageFile, signal) => {
    const formData = new FormData()
    formData.append('file', imageFile)
    
    return fetch('/ask/file', {
        method: 'POST',
        body: formData,
        signal: signal
    })
}