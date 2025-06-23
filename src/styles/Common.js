import styled from 'styled-components'

export const mainColor = '#007aff'

export const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    // min-height: calc(100vh - 4rem);
    // min-height: calc(100dvh - 4rem);
    padding: 0 10rem;
    
    & > h1 {
        font-weight: 400;
        text-align: center;
    }

    & > #question {
        display: flex;
        background-color: white;
        padding: 12px 20px;
        border-radius: 2rem;
        border: 1px solid lightgray;
        box-shadow: 0 2px 16px 0 #00000008;
        margin: 0 10%;
        
        & > input {
            border: none;
            resize: none;
            width: 100%;
        }

        & > input:focus {
            outline: none;
        }

        // & > input::placeholder {
        //     font-size: 16px;
        //     font-family: roboto;
        // }
    }

    & > #question:focus-within {
        border: 1px solid ${mainColor};
    }
`