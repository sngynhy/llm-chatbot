export const askQuestionApi = (data, signal) => {
    return fetch(`/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: signal
    })
}

export const askWithImageApi = (imageFile, signal) => {
    const formData = new FormData()
    formData.append('file', imageFile) 
    return fetch('/api/ask/file', {
        method: 'POST',
        body: formData,
        signal: signal
    })
}