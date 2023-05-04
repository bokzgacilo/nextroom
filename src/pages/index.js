import { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import Chat from './components/Chat'
import axios from 'axios'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import fileDownload from 'js-file-download'

// MUI
import {
  Menu, 
  MenuItem,
  Button,
} from '@mui/material'

function App() {
  const [chats, setChats] = useState([])
  const [Files, setFiles] = useState([])
  const [message, setMessage] = useState("")
  const [FileToUpload, setFileToUpload] = useState()
  const [User, setUser] = useState([])
  const [Auth, setAuth] = useState(false)
  const [TempPath, setTempPath] = useState("")

  // Sending Chat
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

    axios.post('https://nextroom.vercel.app/api/postchat', data)
    .then((response) => {
      console.log('Chat updated')
    })
  }


  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if(user){
      setAuth(user.aud)
      setUser(user)
    }
  }
  
  // Login
  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  // Logout
  async function handleLogout() {
    let { error } = await supabase.auth.signOut()
    setAuth(false)
  }

  // Generate Download Public File URL and Update Database
  const generatePublicUrl = async (filepath) => {
    const { data, error } = await supabase
    .storage
    .from('files')
    .getPublicUrl(filepath)

    const filedata = {
      path: data.publicUrl,
      filename: FileToUpload.name
    }

    axios.post('https://nextroom.vercel.app/api/postfile', filedata)
    .then((response) => {
      console.log(response)
    })
  }

  // Handle File Upload
  const handleFileUpload = async () => {
    const { data, error } = await supabase
    .storage
    .from('files')
    .upload(`room 1/${FileToUpload.name}`, FileToUpload, {
      cacheControl: '3600',
      upsert: false
    })

    
    generatePublicUrl(data.path)
  }

  useEffect(() => {
    const getAllChats = async () => {
      axios.get('https://nextroom.vercel.app/api/getchat')
      .then((response) => {
        const responseChatData = response.data;
  
        if(responseChatData !== null){
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
    }

    const getAllFiles = async () => {
      axios.get('https://nextroom.vercel.app/api/getfile')
      .then((response) => {
        const responseChatData = response.data;
  
        if(responseChatData !== null){
          const oldFiles = responseChatData.map((file, key) => (
            <a 
              key={key}
              href={file.path}
              target='_blank'
            >
              {file.filename}
            </a>
          ))  
          setFiles([...Files, oldFiles])
        }
      })
    }

    const watcher = async () => {
      await supabase
      .channel('table_db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, payload => {
        getAllChats()
        getAllFiles()
      })
      .subscribe()
    }

    getUser();
    watcher();
    getAllChats();
    getAllFiles();
  }, [])

  const [MenuElement, setMenuElement] = useState(null)
  const open = Boolean(MenuElement)

  const openDialog = (event) => {
    setMenuElement(event.currentTarget)
  }

  const closeDialog = () => {
    setMenuElement(null)
  }

  return (
    <div className={styles.App}>
      <main className={styles.chat_container}>
        <header>
          <h2>Chat Room</h2>
            {Auth == 'authenticated' ? 
            <div className={styles.account}>
              <Image 
                referrerPolicy="no-referrer"
                width={40}
                height={40}
                onClick={openDialog}
                alt={User.user_metadata.full_name}
                src={User.user_metadata.picture}
              />
              
              <Menu
                id="basic-menu"
                anchorEl={MenuElement}
                open={open}
                onClose={closeDialog}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem>{User.user_metadata.full_name}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>

            </div>
            : 
              <Button onClick={handleLogin} variant="contained">Login</Button>
            }
        </header>
        <article>
          { Auth == 'authenticated' ? 
            chats : 'You need to login to see chats'
          }
        </article>
        <form onSubmit={handleSend}>
          { Auth == 'authenticated' ? 
            <>
              <input required value={message} onChange={(e) => setMessage(e.currentTarget.value)} type='text' placeholder='Enter something...' />
            </> : ''
          }
        </form>
      </main>
      { Auth == 'authenticated' ? 
        <aside className={styles.chat_details}>
          <h2>Chat Uploads</h2>
          <div>
            <input type='file' name='file' onChange={(e) => setFileToUpload(e.target.files[0])}/>
            <button onClick={handleFileUpload}>Upload File</button>
          </div>
          <div className={styles.fileList}>
            {Files}
          </div>
        </aside> : ''
      }
      
    </div>
    
  )
}

export default App
