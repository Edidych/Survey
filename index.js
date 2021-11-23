const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Method": "GET, POST, PUT, DELETE, PATCH"
}

const postAnswer = (answer, id) => {
    fetch("http:localhost:3000/answers", {
        headers,
        method: "POST",
        body: JSON.stringify({ id, answer })
    })
}

const renderRadioControls = (answers) => {
    const inputContainer = document.querySelector(".inputContainer")
    inputContainer.innerHTML = ""

    const radioElementsArray = answers.map(({ answer }) => {
        const wrapper = document.createElement("div")
        const title = document.createElement("span")
        title.innerHTML = answer
        const input = document.createElement("input")
        input.value = answer
        input.type = "radio" 
        input.name = "radio"

        wrapper.appendChild(input)
        wrapper.appendChild(title)

        return wrapper
    })

    radioElementsArray.forEach((element) => {
        inputContainer.appendChild(element)
    })
}

const renderСheckboxControls = (answers) => {
    const inputContainer = document.querySelector(".inputContainer")
    inputContainer.innerHTML = ""

    const checkboxElementsArray = answers.map(({ answer }) => {
        const wrapper = document.createElement("div")
        const title = document.createElement("span")
        title.innerHTML = answer
        const input = document.createElement("input")
        input.value = answer
        input.type = "checkbox" 

        wrapper.appendChild(input)
        wrapper.appendChild(title)        

        return wrapper
    })

    checkboxElementsArray.forEach((element) => {
        inputContainer.appendChild(element)
    })
}

const renderTextControls = () => {
    const inputContainer = document.querySelector(".inputContainer")
    inputContainer.innerHTML = ""

    const input = document.createElement("input")
    input.type = "text" 

    inputContainer.appendChild(input)
}

const renderAnswerControls = {
    radio: renderRadioControls,
    checkbox: renderСheckboxControls,
    text: renderTextControls
}

const getButtonNames = async () => {
    const buttonNamesResponse = await fetch("http:localhost:3000/buttonsName", {
        headers,
        method: "GET",
    })

    const buttonNames = await buttonNamesResponse.json()

    return buttonNames
}

const getQuestions = async () => {
    const questionsResponse = await fetch("http:localhost:3000/questions", {
        headers,
        method: "GET",
    })

    const questions = await questionsResponse.json()

    return questions
}


const app = async () => {
    const buttonNames = await getButtonNames()
    const questions = await getQuestions()

    const renderForm = async () => {
        const button = document.querySelector(".button")
        button.innerHTML = buttonNames.nameStartButton
        button.disabled = true
        button.id = 0
        button.addEventListener("click", async (event) => {
            const stepId = +event.target.id

            if (stepId < 4) {
                const questionProperties = questions[stepId]

                if (stepId === 0) {
                    button.innerHTML = buttonNames.nameNextButton
                    const userNameElement = document.createElement("p")
                    const input = document.querySelector(".input")
                    userNameElement.innerHTML = "Опрос проходит: " + input.value
                    const nameContainer = document.querySelector(".nameContainer")
                    nameContainer.appendChild(userNameElement)
                }

                if (stepId === 1 || stepId === 2) {
                    const answer = document.querySelector('input[name="radio"]:checked').value;
                    postAnswer(answer, stepId)
                }

                if (stepId === 3) {
                    button.innerHTML = buttonNames.nameFinishButton

                    const answers = []
                    const nodesArray = document.querySelectorAll('input[type="checkbox"]:checked');
                    nodesArray.forEach((node) => {
                        answers.push(node.value)
                    })
                    postAnswer(answers, stepId)
                }
    
                const questionContainer = document.querySelector(".questionContainer")
                questionContainer.innerHTML = ""
    
                const question = document.createElement("p")
                question.innerHTML = questionProperties.quest
                questionContainer.appendChild(question)
    
                renderAnswerControls[questionProperties.answerType](questionProperties.answers)  
            } else {
                const answer = document.querySelector("input").value
                postAnswer(answer, stepId)

                const questionContainer = document.querySelector(".questionContainer")
                questionContainer.innerHTML = ""

                const inputContainer = document.querySelector(".inputContainer")
                inputContainer.innerHTML = ""

                const buttonConteiner = document.querySelector(".buttonConteiner")
                buttonConteiner.innerHTML = ""

                const answersResponse = await fetch("http:localhost:3000/answers", {
                    headers,
                    method: "GET",
                })
                const answers = await answersResponse.json()
                const questionsArray = questions.map(({ quest }) => quest)

                const answersContainer = document.querySelector(".answersContainer")

                answers.forEach(({ answer }, index) => {
                    const questionElement = document.createElement("p")
                    questionElement.innerHTML = questionsArray[index]
                    questionElement.className = "question"
                    answersContainer.appendChild(questionElement)
                    
                    if (typeof answer === 'object') {
                        answer.forEach((item) => {
                            const answerElement = document.createElement("p")
                            answerElement.className = "answer"
                            answerElement.innerHTML = item
                            answersContainer.appendChild(answerElement)
                        })
                    } else {
                        const answerElement = document.createElement("p")
                        answerElement.innerHTML = answer
                        answerElement.className = "answer"
                        answersContainer.appendChild(answerElement)
                    }
                })
            }
            
            button.id = stepId + 1
        })

        const input = document.querySelector(".input")
        input.addEventListener("change", (event) => {
            button.disabled = !event.target.value 

        })
        
    }

    renderForm()
}
app()

