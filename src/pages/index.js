import { useState } from 'react'
import styles from '@/styles/Home.module.css'
import Chat from './components/Chat'

function App() {
  const [chats, setChats] = useState([])
  const [message, setMessage] = useState("")

  const handleSend = (event) => {
    event.preventDefault();
    const newChat = <Chat
      key={chats.length}
      sender={"Ariel Jericko Gacilo"}
      message={message} />
    setChats([...chats, newChat])
    setMessage("")
  }

  return (
    <main className={styles.App}>
      <header>
        <h2>Chat Room</h2>
      </header>
      <article>
        {chats}
      </article>
      <form onSubmit={handleSend}>
        <input required value={message} onChange={(e) => setMessage(e.currentTarget.value)} type='text' placeholder='Enter something...' />
        <button type='submit'>SEND</button>
      </form>
    </main>
  )
}

export default App
