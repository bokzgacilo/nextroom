import { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import Chat from './components/Chat'
import axios from 'axios'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'

function App() {
  const [chats, setChats] = useState([])
  const [message, setMessage] = useState("")
  const [chatData, setchatData] = useState([])
  const [User, setUser] = useState([])
  const [Auth, setAuth] = useState(false)

  const handleSend = async (event) => {
    event.preventDefault();
    const newChat = <Chat
      key={chats.length}
      sender={User.user_metadata.full_name}
      message={message}
      picture={User.user_metadata.picture} />
    setChats([...chats, newChat])
    setMessage("")

    const data = {
      sender: User.user_metadata.full_name,
      message: message,
      picture: User.user_metadata.picture
    }

    axios.post('http://localhost:3000/api/postchat', data)
    .then((response) => {
      console.log('Chat updated')
    })
  }

  const watcher = async () => {
    const rooms = await supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'rooms' },
      async (payload) => {
        console.log('Chats changed')
        console.log('Change received!', payload)
      }
    )
    .subscribe()
  }

  const getAllRoomChats = async () => {
    axios.get('http://localhost:3000/api/hello')
    .then((response) => {
      const responseChatData = response.data;

      console.log(responseChatData)
      if(responseChatData === null){

      }else {
        const previousChats = responseChatData.map((chat, key) => (
          <Chat 
            key={key}
            sender={chat.sender}
            message={chat.message}
            picture={chat.picture}
          />
        ))  
  
        setChats([...chats, previousChats])
      }
    })

    console.log('Called on reload')
  }

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if(user){
      setAuth(user.aud)
      setUser(user)
      console.log(user)
    }
  }

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  async function handleLogout() {
    let { error } = await supabase.auth.signOut()
    setAuth(false)
  }

  useEffect(() => {
    getAllRoomChats()
    getUser()
    watcher()
  }, [])

  return (
    <main className={styles.App}>
      <header>
        <h2>Chat Room</h2>
          {Auth == 'authenticated' ? 
          <div className={styles.account}>
            <Image 
              width={35}
              height={35}
              alt="My Avatar" 
              src={User.user_metadata.picture}
            />
            <p>
              {User.user_metadata.full_name}
            </p>
            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
          : 
            <button onClick={handleLogin}>
              Login
            </button>
          }
      </header>
      <article>
        { Auth == 'authenticated' ? 
          chats : 'You need to login to see chats'
        }
      </article>
      <form onSubmit={handleSend}>
        <input required value={message} onChange={(e) => setMessage(e.currentTarget.value)} type='text' placeholder='Enter something...' />
        <button type='submit'>SEND</button>
      </form>
    </main>
  )
}

export default App
