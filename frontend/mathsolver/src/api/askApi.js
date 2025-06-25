export const askQuestionApi = (question) => {
    return fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question }),
    })
}

export const askWithImageApi = (imageFile) => {
    const formData = new FormData()
    formData.append('file', imageFile)
    
    return fetch('/ask/file', {
        method: 'POST',
        body: formData
    })
}