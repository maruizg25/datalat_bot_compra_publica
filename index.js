const API_KEY = 'apykey' 


const chatbotConversation = document.querySelector('#chatbot-conversation')
const button = document.querySelector('#generar')
const prompt = document.querySelector('#prompt')
let conversationStr = ''

button.addEventListener('click', async (e) => {
    e.preventDefault()
    if (!prompt.value) return
    conversationStr += `${prompt.value} ->`
    fetchReply()
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = prompt.value
    prompt.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
})



async function fetchReply() {
    const res = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
        },
        body: JSON.stringify({
            //modelos entrendados
            //model: 'ft:davinci-002:datalat::8CCYJlHP',
            model: 'davinci:ft-personal:compra-publica-2023-10-21-19-54-19',
            //model: 'davinci:ft-personal:model-compra-2023-10-19-07-06-58', (primer modelo)
            prompt: conversationStr,
            top_p: 1,
            presence_penalty: 0,
            frequency_penalty: 0.3,
            max_tokens: 100,
            stop: ['END'],

        })
    })
    const reply = await res.json()
    console.log(reply)
    conversationStr += reply.choices[0].text
    renderTypewriterText(reply.choices[0].text)




}
// const output = document.querySelector('#output')

// button.addEventListener('click', async () => {
//     if (!prompt.value) return
//     const reply = await fetchReply(prompt.value)
//     output.innerHTML = reply.choices[0].text
// })

function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
    chatbotConversation.appendChild(newSpeechBubble)
    let i = 0
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text.slice(i - 1, i)
        if (text.length === i) {
            clearInterval(interval)
            newSpeechBubble.classList.remove('blinking-cursor')
        }
        i++
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    }, 50)
}