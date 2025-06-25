import styled from 'styled-components'

export const mainColor = '#007aff'
export const mainBackColor = '#f3f5f7'

export const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    // gap: 1rem;
    // min-height: calc(100vh - 4rem);
    // min-height: calc(100dvh - 4rem);
    padding: 0 10rem;
    
    & > h1 {
        font-weight: 400;
        text-align: center;
        margin: 2rem 0;
    }

    & > #question {
        display: flex;
        justify-content: space-between;
        background-color: white;
        padding: 12px 20px;
        border-radius: 2rem;
        border: 1px solid lightgray;
        box-shadow: 0 2px 16px 0 #00000008;
        margin: 0 10%;
        height: 2rem;

        &:focus-within {
            border: 1px solid ${mainColor};
        }
        
        & > input {
            border: none;
            resize: none;
            width: 100%;
        }

        & > input:focus {
            outline: none;
        }

        & > #file {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0 5px;

            & > span {
                display: flex;
                padding: 5px;
                border-radius: 6px;
                cursor: pointer;
                
                &:hover {
                    background-color: ${mainBackColor}
                }

                & > div {
                    margin-right: 5px;
                }
            }
        }
    }
`