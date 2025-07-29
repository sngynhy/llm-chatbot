export const actionType = {
    addMessage: 'ADD_MESSAGE',
    resetMessage: 'RESET_MESSAGE',
}

export const chatReducer = (state = { chatId: '', messages: [] }, action) => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return [...state, {
                chatId: action.payload.chatId,
                content: action.payload.content,
                role: action.payload.role,
                isLatex: action.payload.isLatex || false,
                createdAt: Date.now()
            }]

        case 'RESET_MESSAGE':
            return []

        default:
            return state
    }
}