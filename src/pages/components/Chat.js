import Image from 'next/image';
import style from './chat.module.css';

const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

export default function Chat(props) {
  return (
    <div className={style.chat}>
      <div className='avatar'>
        <Image 
          loader={myLoader}
          width={40}
          height={40}
          alt={props.sender}
          src={props.picture} 
          referrerPolicy="no-referrer"
        />
      </div>
      <div className={style.details}>
        <h4>{props.sender}</h4>
        <p>{props.message}</p>
      </div>
    </div>
  )
}